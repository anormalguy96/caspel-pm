const fs = require('fs');
const path = require('path');
const root = 'd:/github_repos/platform';
const temp = path.join(root, 'common/temp/node_modules/.pnpm');
const entry = fs.readdirSync(temp).find((d) => d.startsWith('puppeteer@'));
const puppeteer = require(path.join(temp, entry, 'node_modules/puppeteer'));

async function verify() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://huly.local:8087/login:component:LoginApp/login...');
  await page.goto('http://huly.local:8087/login:component:LoginApp/login', { waitUntil: 'networkidle0' });

  await new Promise(r => setTimeout(r, 2000));

  const pageTitle = await page.title();
  console.log('Page Title:', pageTitle);

  // Inspect page DOM
  const info = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt,
      width: img.clientWidth,
      height: img.clientHeight
    }));
    const buttons = Array.from(document.querySelectorAll('button, a, .tab, span, div'))
      .map(el => el.textContent.trim())
      .filter(t => t.length > 0 && t.length < 50);
    const hasSignUp = buttons.some(t => t.toLowerCase() === 'sign up');
    const hasLogIn = buttons.some(t => t.toLowerCase() === 'log in');
    const hasGuest = buttons.some(t => t.toLowerCase().includes('continue as a guest') || t.toLowerCase().includes('guest'));
    const loginHeader = document.querySelector('.login-header, .header, .title')?.textContent;
    return {
      images,
      hasSignUp,
      hasLogIn,
      hasGuest,
      loginHeader,
      bodyTextSnippet: document.body.innerText.slice(0, 300)
    };
  });

  console.log('Inspection result:', JSON.stringify(info, null, 2));

  const artifactPath = 'C:\\Users\\Huawei\\.gemini\\antigravity-ide\\brain\\ad6ae1e5-42e9-4699-afbc-31a179fe792e\\caspel_login_fresh.png';
  await page.screenshot({ path: artifactPath });
  console.log('Saved screenshot to:', artifactPath);

  await browser.close();
}

verify().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
