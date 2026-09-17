const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', '..');
const temp = path.join(root, 'common/temp/node_modules/.pnpm');
const entry = fs.readdirSync(temp).find((d) => d.startsWith('puppeteer@'));
const puppeteer = require(path.join(temp, entry, 'node_modules/puppeteer'));

function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const entries = [];
  let offset = 6 + 16 * pngs.length;
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const lightSourcePath = path.join(root, 'logos/1705927011_caspel.png');
  const darkSourcePath = path.join(root, 'logos/footer_logo_16843049791615629263.png');

  const lightBuf = fs.readFileSync(lightSourcePath);
  const darkBuf = fs.readFileSync(darkSourcePath);

  const lightDataUrl = 'data:image/png;base64,' + lightBuf.toString('base64');
  const darkDataUrl = 'data:image/png;base64,' + darkBuf.toString('base64');

  await page.setContent(`
    <html>
      <body style="margin:0;">
        <img id="light" src="${lightDataUrl}">
        <img id="dark" src="${darkDataUrl}">
      </body>
    </html>
  `);

  const analysis = await page.evaluate(() => {
    function analyze(imgId) {
      const img = document.getElementById(imgId);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

      const rowCounts = new Array(canvas.height).fill(0);
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          if (d[(y * canvas.width + x) * 4 + 3] > 20) rowCounts[y]++;
        }
      }

      let markTop = -1, markBottom = -1, textTop = -1, textBottom = -1;
      let inMark = false, inText = false;
      for (let y = 0; y < canvas.height; y++) {
        if (rowCounts[y] > 0) {
          if (!inMark && markBottom === -1) {
            inMark = true;
            markTop = y;
          } else if (!inText && markBottom !== -1) {
            inText = true;
            textTop = y;
          }
        } else {
          if (inMark) {
            inMark = false;
            markBottom = y - 1;
          } else if (inText) {
            inText = false;
            textBottom = y - 1;
          }
        }
      }
      if (inText && textBottom === -1) textBottom = canvas.height - 1;

      let markLeft = canvas.width, markRight = 0;
      for (let y = markTop; y <= markBottom; y++) {
        for (let x = 0; x < canvas.width; x++) {
          if (d[(y * canvas.width + x) * 4 + 3] > 20) {
            markLeft = Math.min(markLeft, x);
            markRight = Math.max(markRight, x);
          }
        }
      }

      return {
        width: canvas.width,
        height: canvas.height,
        mark: {
          x: markLeft,
          y: markTop,
          width: markRight - markLeft + 1,
          height: markBottom - markTop + 1
        },
        text: {
          y: textTop,
          height: textBottom - textTop + 1
        }
      };
    }

    return {
      light: analyze('light'),
      dark: analyze('dark')
    };
  });

  console.log('Analysis results:', JSON.stringify(analysis, null, 2));

  // Now create the square mark from light (navy mark) and dark (white mark)
  // For icons and favicons, the square mark (circuit + diamond) is the authentic mark.
  // Let's render cropped square marks with padding as needed.

  const outDir = path.join(root, 'dev/prod/public/caspel-pm');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  async function renderCroppedIcon(sourceDataUrl, markBox, targetSize, { paddingRatio = 0.08, background = 'transparent' } = {}) {
    const renderPage = await browser.newPage();
    await renderPage.setViewport({ width: targetSize, height: targetSize, deviceScaleFactor: 1 });

    const html = `
      <html>
        <body style="margin:0;width:${targetSize}px;height:${targetSize}px;background:${background};display:flex;align-items:center;justify-content:center;overflow:hidden;">
          <canvas id="c" width="${targetSize}" height="${targetSize}"></canvas>
        </body>
      </html>
    `;
    await renderPage.setContent(html);

    await renderPage.evaluate((url, box, size, pad) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.getElementById('c');
          const ctx = canvas.getContext('2d');
          const maxDim = Math.max(box.width, box.height);
          const padPixels = size * pad;
          const availSize = size - padPixels * 2;
          const scale = availSize / maxDim;
          const drawW = box.width * scale;
          const drawH = box.height * scale;
          const drawX = (size - drawW) / 2;
          const drawY = (size - drawH) / 2;
          ctx.drawImage(img, box.x, box.y, box.width, box.height, drawX, drawY, drawW, drawH);
          resolve();
        };
        img.src = url;
      });
    }, sourceDataUrl, markBox, targetSize, paddingRatio);

    const buf = await renderPage.screenshot({ type: 'png', omitBackground: background === 'transparent' });
    await renderPage.close();
    return buf;
  }

  // Render full logo (stacked lockup / horizontal lockup)
  async function renderFullLogo(sourceDataUrl, width, height, { background = 'transparent' } = {}) {
    const renderPage = await browser.newPage();
    await renderPage.setViewport({ width, height, deviceScaleFactor: 1 });
    await renderPage.setContent(`
      <html>
        <body style="margin:0;width:${width}px;height:${height}px;background:${background};display:flex;align-items:center;justify-content:center;">
          <img src="${sourceDataUrl}" style="max-width:96%;max-height:96%;object-fit:contain;">
        </body>
      </html>
    `);
    const buf = await renderPage.screenshot({ type: 'png', omitBackground: background === 'transparent' });
    await renderPage.close();
    return buf;
  }

  const markBox = analysis.light.mark;
  console.log('Rendering derivative icons using exact mark bounds:', markBox);

  // 1. icon-192.png, icon-512.png, icon-1024.png
  fs.writeFileSync(path.join(outDir, 'icon-192.png'), await renderCroppedIcon(lightDataUrl, markBox, 192));
  fs.writeFileSync(path.join(outDir, 'icon-512.png'), await renderCroppedIcon(lightDataUrl, markBox, 512));
  fs.writeFileSync(path.join(outDir, 'icon-1024.png'), await renderCroppedIcon(lightDataUrl, markBox, 1024));
  console.log('Wrote standard PWA icons (192, 512, 1024)');

  // 2. apple-touch-icon.png (180x180 with navy background #0A2A3D using white/dark mark)
  const darkMarkBox = analysis.dark.mark;
  fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), await renderCroppedIcon(darkDataUrl, darkMarkBox, 180, { paddingRatio: 0.15, background: '#0A2A3D' }));
  console.log('Wrote apple-touch-icon.png');

  // 3. icon-maskable-512.png (512x512 with safe zone padding on #0A2A3D background)
  fs.writeFileSync(path.join(outDir, 'icon-maskable-512.png'), await renderCroppedIcon(darkDataUrl, darkMarkBox, 512, { paddingRatio: 0.2, background: '#0A2A3D' }));
  console.log('Wrote icon-maskable-512.png');

  // 4. favicon.ico (multi-size: 16, 32, 48)
  const icoPngs = [];
  for (const size of [16, 32, 48]) {
    icoPngs.push({
      size,
      data: await renderCroppedIcon(lightDataUrl, markBox, size, { paddingRatio: 0.04 })
    });
  }
  fs.writeFileSync(path.join(outDir, 'favicon.ico'), buildIco(icoPngs));
  console.log('Wrote favicon.ico');

  // 5. Full logos for web usage (light & dark)
  fs.writeFileSync(path.join(outDir, 'logo-light.png'), await renderFullLogo(lightDataUrl, 600, 540));
  fs.writeFileSync(path.join(outDir, 'logo-dark.png'), await renderFullLogo(darkDataUrl, 600, 540));
  console.log('Wrote logo-light.png and logo-dark.png');

  // 6. Generate crisp SVG favicon that embeds the clean high-resolution mark
  // Also create a standalone mark PNG: mark-light.png (navy) and mark-dark.png (white)
  const markNavyBuf = await renderCroppedIcon(lightDataUrl, markBox, 256, { paddingRatio: 0.05 });
  const markWhiteBuf = await renderCroppedIcon(darkDataUrl, darkMarkBox, 256, { paddingRatio: 0.05 });
  fs.writeFileSync(path.join(outDir, 'mark-navy.png'), markNavyBuf);
  fs.writeFileSync(path.join(outDir, 'mark-white.png'), markWhiteBuf);

  // SVG favicon using data URL embedding of the real mark
  const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <image href="data:image/png;base64,${markNavyBuf.toString('base64')}" width="256" height="256"/>
</svg>
`;
  fs.writeFileSync(path.join(outDir, 'favicon.svg'), svgFavicon);
  console.log('Wrote favicon.svg');

  await browser.close();
  console.log('All authentic Caspel brand assets generated successfully!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
