import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err));

  await page.goto('https://osama-aloudat.web.app', { waitUntil: 'networkidle0' });

  // Open modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Apply for Mentorship'));
    btn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Check state before and click close
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button[aria-label="Close"]');
    console.log('closeBtn element:', closeBtn);
    closeBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  });
  await new Promise(r => setTimeout(r, 500));

  const count = await page.evaluate(() => {
    return document.querySelectorAll('button[aria-label="Close"]').length;
  });
  console.log('Close buttons count after click:', count);

  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
