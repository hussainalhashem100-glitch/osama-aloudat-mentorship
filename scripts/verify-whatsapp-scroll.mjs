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
  console.log('Navigating to live site...');
  await page.goto('https://osama-aloudat.web.app', { waitUntil: 'networkidle0' });

  // 1. Check at Top / Middle (e.g., scroll to Results Wall)
  console.log('Scrolling to Results Wall (#results)...');
  await page.evaluate(() => {
    const el = document.getElementById('results');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 600));

  // Verify WhatsApp widget is hidden
  const isVisibleAtResults = await page.evaluate(() => {
    const waEl = document.querySelector('div.fixed.bottom-6');
    if (!waEl) return false;
    return waEl.classList.contains('opacity-100');
  });
  console.log('Is WhatsApp visible at Results Wall?', isVisibleAtResults);

  const resultsScreenshot = path.join(ARTIFACTS_DIR, 'whatsapp_hidden_at_results.png');
  await page.screenshot({ path: resultsScreenshot });
  console.log('Saved screenshot to', resultsScreenshot);

  // 2. Scroll to High-Yield Guides (#articles)
  console.log('Scrolling to High-Yield Guides (#articles)...');
  await page.evaluate(() => {
    const el = document.getElementById('articles');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 600));

  // Verify WhatsApp widget is now visible
  const isVisibleAtArticles = await page.evaluate(() => {
    const waEl = document.querySelector('div.fixed.bottom-6');
    if (!waEl) return false;
    return waEl.classList.contains('opacity-100');
  });
  console.log('Is WhatsApp visible at High-Yield Guides (#articles)?', isVisibleAtArticles);

  const articlesScreenshot = path.join(ARTIFACTS_DIR, 'whatsapp_visible_at_articles.png');
  await page.screenshot({ path: articlesScreenshot });
  console.log('Saved screenshot to', articlesScreenshot);

  await browser.close();

  if (isVisibleAtResults === false && isVisibleAtArticles === true) {
    console.log('VERIFICATION SUCCESSFUL: WhatsApp widget only appears at High-Yield Guides!');
  } else {
    throw new Error(`Verification failed: atResults=${isVisibleAtResults}, atArticles=${isVisibleAtArticles}`);
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
