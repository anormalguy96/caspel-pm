const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', '..');
const temp = path.join(root, 'common/temp/node_modules/.pnpm');
const entry = fs.readdirSync(temp).find((d) => d.startsWith('puppeteer@'));
const puppeteer = require(path.join(temp, entry, 'node_modules/puppeteer'));

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 800 });

  const logos = [
    '1705927011_caspel.png',
    'caspel_logo_no_bg.png',
    'caspel_logo_no_bg-recolored.png',
    'footer_logo_16843049791615629263.png'
  ];

  for (const f of logos) {
    const p = path.join(root, 'logos', f);
    const buf = fs.readFileSync(p);
    const dataUrl = 'data:image/png;base64,' + buf.toString('base64');
    const outName = 'preview_' + f.replace('.png', '') + '.png';
    const bg = f.includes('recolored') || f.includes('footer') ? '#0A2A3D' : '#F5F5F5';
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body style="margin:0;background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;">
          <h2 style="color:${bg === '#0A2A3D' ? '#fff' : '#000'};font-family:sans-serif;">${f}</h2>
          <img src="${dataUrl}" style="max-width:800px;max-height:600px;border:1px dashed #888;">
        </body>
      </html>
    `);
    await page.screenshot({ path: path.join(__dirname, outName) });
    console.log('Saved', outName);
  }
  await browser.close();
}

main().catch(console.error);
