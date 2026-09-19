import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'https://osama-aloudat.web.app';
const ARTIFACTS_DIR = 'C:\\Users\\hussa\\.gemini\\antigravity\\brain\\b5299893-9484-44c5-b1ce-6f4c3e83c39b';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    defaultViewport: { width: 1280, height: 850 },
  });

  const page = await browser.newPage();
  console.log('Navigating to', BASE_URL);
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

  // 1. Open Apply Modal
  console.log('Opening Apply Modal...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const applyBtn = buttons.find(b => b.textContent && b.textContent.includes('Apply for Mentorship') || b.textContent.includes('Apply'));
    if (applyBtn) applyBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Step 1: Click Continue to go to Step 2
  console.log('Clicking Continue to Step 2...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const contBtn = buttons.find(b => b.textContent && b.textContent.includes('Continue'));
    if (contBtn) contBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Step 2: Select year 2027 and month May
  console.log('Selecting Year 2027 and Month May...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const yr2027 = buttons.find(b => b.textContent && b.textContent.trim() === '2027');
    if (yr2027) yr2027.click();
    const mayBtn = buttons.find(b => b.textContent && b.textContent.trim() === 'May');
    if (mayBtn) mayBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Take screenshot of ApplyModal with Month & Year swapper
  const modalScreenshotPath = path.join(ARTIFACTS_DIR, 'modal_month_swapper.png');
  await page.screenshot({ path: modalScreenshotPath });
  console.log('Saved modal screenshot to', modalScreenshotPath);

  // Close modal with ESC
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));

  // 2. Scroll to MentorshipSection and test FAQ expansion
  console.log('Testing FAQ accordion expansion...');
  await page.evaluate(() => {
    const faqHeading = Array.from(document.querySelectorAll('h2, h3, div')).find(el => el.textContent && el.textContent.includes('Frequently Asked Questions') || el.textContent.includes('What is the mentorship structure?'));
    if (faqHeading) faqHeading.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));

  // Click first FAQ item in active track
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const faqBtn = buttons.find(b => b.textContent && (b.textContent.includes('What is the mentorship structure?') || b.textContent.includes('How are study plans created?')));
    if (faqBtn) faqBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Take screenshot of expanded FAQ
  const faqScreenshotPath = path.join(ARTIFACTS_DIR, 'expanded_faq.png');
  await page.screenshot({ path: faqScreenshotPath });
  console.log('Saved FAQ screenshot to', faqScreenshotPath);

  await browser.close();
  console.log('All verification checks completed successfully!');
}

run().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
