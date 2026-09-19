import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hussa\\.gemini\\antigravity\\brain\\b5299893-9484-44c5-b1ce-6f4c3e83c39b';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    defaultViewport: { width: 1280, height: 950 },
  });
  const page = await browser.newPage();
  console.log('Navigating to live site...');
  await page.goto('https://osama-aloudat.web.app', { waitUntil: 'networkidle0' });

  // Scroll to footer
  console.log('Scrolling to footer...');
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await new Promise(r => setTimeout(r, 600));

  // Find and click the Email button in the footer
  console.log('Clicking Email button...');
  const emailBtn = await page.waitForSelector('footer button[aria-label="Email Options"]');
  await emailBtn.click();
  await new Promise(r => setTimeout(r, 500));

  // Screenshot open menu
  const menuScreenshot = path.join(ARTIFACTS_DIR, 'email_action_menu.png');
  await page.screenshot({ path: menuScreenshot });
  console.log('Saved menu screenshot to', menuScreenshot);

  // Click 'Copy Email Address' button
  console.log('Clicking Copy Email Address...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('footer button'));
    const copyBtn = buttons.find(b => b.textContent && b.textContent.includes('Copy Email Address'));
    if (copyBtn) copyBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Screenshot centered copied toast
  const toastScreenshot = path.join(ARTIFACTS_DIR, 'email_copied_centered_message.png');
  await page.screenshot({ path: toastScreenshot });
  console.log('Saved copied toast screenshot to', toastScreenshot);

  await browser.close();
  console.log('Verification completed successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
