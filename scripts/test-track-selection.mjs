import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('Navigating to live site...');
  await page.goto('https://osama-aloudat.web.app', { waitUntil: 'networkidle0' });

  // 1. Open modal
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Apply for Mentorship'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // 2. Click USMLE Step 2 CK card
  console.log('Clicking USMLE Step 2 CK card...');
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div.cursor-pointer'));
    const card = cards.find(el => el.textContent && el.textContent.includes('USMLE Step 2 CK'));
    if (card) card.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // 3. Verify we are STILL on Step 1
  const onStep1AfterClick = await page.evaluate(() => {
    const hasProgramTitle = document.body.textContent.includes('1. Select Program:');
    const hasStage = document.body.textContent.includes('2. Stage & Target Date:');
    return hasProgramTitle && !hasStage;
  });
  console.log('Still on Step 1 after clicking card (did NOT advance automatically):', onStep1AfterClick);

  await page.screenshot({ path: 'C:/Users/hussa/.gemini/antigravity/brain/b5299893-9484-44c5-b1ce-6f4c3e83c39b/track_selected_not_advanced.png' });

  // 4. Click IFOM card
  console.log('Clicking IFOM card...');
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div.cursor-pointer'));
    const card = cards.find(el => el.textContent && el.textContent.includes('IFOM'));
    if (card) card.click();
  });
  await new Promise(r => setTimeout(r, 500));

  const onStep1AfterIfom = await page.evaluate(() => {
    const hasProgramTitle = document.body.textContent.includes('1. Select Program:');
    const hasStage = document.body.textContent.includes('2. Stage & Target Date:');
    return hasProgramTitle && !hasStage;
  });
  console.log('Still on Step 1 after clicking IFOM:', onStep1AfterIfom);

  // 5. Now click "Continue" button
  console.log('Clicking Continue button...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const continueBtn = btns.find(b => b.textContent && b.textContent.includes('Continue'));
    if (continueBtn) continueBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // 6. Verify we are now on Step 2
  const onStep2AfterContinue = await page.evaluate(() => {
    return document.body.textContent.includes('2. Stage & Target Date:');
  });
  console.log('Advanced to Step 2 after clicking Continue:', onStep2AfterContinue);

  await page.screenshot({ path: 'C:/Users/hussa/.gemini/antigravity/brain/b5299893-9484-44c5-b1ce-6f4c3e83c39b/step2_after_continue_clicked.png' });

  await browser.close();
  console.log('Test completed successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
