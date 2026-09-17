const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', '..');
const temp = path.join(root, 'common/temp/node_modules/.pnpm');
const entry = fs.readdirSync(temp).find((d) => d.startsWith('puppeteer@'));
const puppeteer = require(path.join(temp, entry, 'node_modules/puppeteer'));

async function verify() {
  const browser = await puppeteer.launch({ headless: true, defaultViewport: { width: 1440, height: 900 } });
  const page = await browser.newPage();

  console.log('Navigating to http://huly.local:8087/login:component:LoginApp/login...');
  await page.goto('http://huly.local:8087/login:component:LoginApp/login', { waitUntil: 'domcontentloaded' });

  await page.waitForSelector('.form-content');

  const title = await page.title();
  console.log('Page Title:', title);

  const logoSrc = await page.evaluate(() => {
    const img = document.querySelector('.flex-row-center img');
    return img ? img.getAttribute('src') : null;
  });
  console.log('Logo img src:', logoSrc);

  const tabs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.caption a.title, .caption h2.title')).map(el => el.textContent.trim());
  });
  console.log('Visible Tabs/Titles:', tabs);

  const guestButton = await page.evaluate(() => {
    const btn = document.querySelector('.login-as-guest');
    return btn ? btn.textContent.trim() : null;
  });
  console.log('Guest button text:', guestButton);

  const outScreenshot = path.join(root, 'scripts/caspel-pm/live_login_verified.png');
  await page.screenshot({ path: outScreenshot });
  console.log('Saved screenshot to:', outScreenshot);

  await browser.close();
}

verify().catch(console.error);
