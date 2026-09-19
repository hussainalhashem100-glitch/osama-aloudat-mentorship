import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });
  const page = await browser.newPage();

  await page.goto('https://osama-aloudat.web.app', { waitUntil: 'networkidle0' });

  // Test 1: Open modal and test 1-tap track selection
  console.log('Testing 1-tap track selection...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Apply for Mentorship'));
    btn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Click on Step 2 CK track card
  const step2CardFound = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div'));
    const card = cards.find(el => el.textContent && el.textContent.includes('USMLE Step 2 CK') && el.textContent.includes('Target 250+'));
    if (card) {
      card.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Step 2 CK card:', step2CardFound);
  await new Promise(r => setTimeout(r, 500));

  // Verify we are now on Step 2 ("Stage & Target Date" or "Current Stage:")
  const isStep2 = await page.evaluate(() => {
    return document.body.textContent.includes('Stage & Target Date') || document.body.textContent.includes('Current Stage');
  });
  console.log('Advanced to Step 2:', isStep2);

  // Test 2: Close button on Step 2
  console.log('Testing close button on Step 2...');
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button[aria-label="Close"]');
    closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  const countAfterClose = await page.evaluate(() => {
    return document.querySelectorAll('button[aria-label="Close"]').length;
  });
  console.log('Modal closed on Step 2 (count):', countAfterClose);

  // Test 3: Backdrop click closes modal
  console.log('Testing backdrop click...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Apply for Mentorship'));
    btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  
  // Click backdrop (outside the modal box, e.g. at (10, 10))
  await page.mouse.click(10, 10);
  await new Promise(r => setTimeout(r, 500));
  const countAfterBackdrop = await page.evaluate(() => {
    return document.querySelectorAll('button[aria-label="Close"]').length;
  });
  console.log('Modal closed on backdrop click (count):', countAfterBackdrop);

  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
