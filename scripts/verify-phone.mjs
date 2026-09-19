import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS_DIR = 'C:\\Users\\hussa\\.gemini\\antigravity\\brain\\b5299893-9484-44c5-b1ce-6f4c3e83c39b';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    defaultViewport: { width: 1280, height: 850 },
  });
  const page = await browser.newPage();
  await page.goto('https://osama-aloudat.web.app', { waitUntil: 'networkidle0' });

  // Open modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Apply for Mentorship'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Step 1 -> Step 2
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const contBtn = btns.find(b => b.textContent && b.textContent.includes('Continue'));
    if (contBtn) contBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Step 2: Select Stage
  const select = await page.waitForSelector('select');
  await select.select('Medical Student (Clinical)');
  await new Promise(r => setTimeout(r, 400));

  // Step 2 -> Step 3
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nextBtn = btns.find(b => b.textContent && b.textContent.includes('Contact Details'));
    if (nextBtn) nextBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // In Step 3: Type Full Name, Phone, and Email using page.type
  const nameInput = await page.waitForSelector('input[type="text"]');
  await nameInput.type('Dr. Hussain Al-Hashem');

  const phoneInput = await page.waitForSelector('input[type="tel"]');
  await phoneInput.type('0795770421');

  const emailInput = await page.waitForSelector('input[type="email"]');
  await emailInput.type('hussain@example.com');
  await new Promise(r => setTimeout(r, 400));

  // Submit form
  const submitBtn = await page.waitForSelector('button[type="submit"]');
  await submitBtn.click();
  await new Promise(r => setTimeout(r, 900));

  // Screenshot Success Confirmation
  const successScreenshot = path.join(ARTIFACTS_DIR, 'phone_confirmation_with_country_code.png');
  await page.screenshot({ path: successScreenshot });
  console.log('Saved success screenshot to', successScreenshot);

  await browser.close();
  console.log('Test completed successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
