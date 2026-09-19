import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('https://osama-aloudat.web.app', { waitUntil: 'networkidle0' });

  // 1. Open modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Apply for Mentorship'));
    btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'C:/Users/hussa/.gemini/antigravity/brain/b5299893-9484-44c5-b1ce-6f4c3e83c39b/apply_modal_step1_working.png' });

  // 2. 1-tap select USMLE Step 2 CK
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div.cursor-pointer'));
    const card = cards.find(el => el.textContent && el.textContent.includes('USMLE Step 2 CK'));
    if (card) card.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'C:/Users/hussa/.gemini/antigravity/brain/b5299893-9484-44c5-b1ce-6f4c3e83c39b/apply_modal_step2_working.png' });

  // 3. Click X button
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button[aria-label="Close"]');
    closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'C:/Users/hussa/.gemini/antigravity/brain/b5299893-9484-44c5-b1ce-6f4c3e83c39b/apply_modal_closed.png' });

  await browser.close();
  console.log('Screenshots captured successfully');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
