import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  console.log('Navigating to live site...');
  await page.goto('https://osama-aloudat.web.app', { waitUntil: 'networkidle0' });

  // 1. Add a custom test article to localStorage just like the user did
  await page.evaluate(() => {
    const raw = localStorage.getItem('osama_mentorship_articles');
    const articles = raw ? JSON.parse(raw) : [];
    articles.unshift({
      id: 'a_custom_test_123',
      slug: 'sdgsdghsadgh',
      title: 'sdgsdghsadgh',
      titleAr: 'مقال تجريبي جديد',
      category: 'USMLE Strategy',
      categoryAr: 'استراتيجية USMLE',
      readTime: '4 min',
      readTimeAr: '٤ دقائق',
      date: 'Sep 2026',
      excerpt: 'dgagshsdh',
      excerptAr: 'نبذة عن المقال التجريبي',
      content: '## High Yield Strategy\n\nThis is a newly created test article.\n\n- Key point 1: Review UWorld thoroughly\n- Key point 2: Master active recall\n\n### Next Steps\nStay disciplined and follow your daily schedule.',
      contentAr: '## استراتيجية عالية الأهمية\n\nهذا مقال تجريبي جديد تمت إضافته بنجاح.\n\n- النقطة الأولى: مراجعة يووورلد بدقة\n- النقطة الثانية: الاسترجاع النشط للمعلومات',
    });
    localStorage.setItem('osama_mentorship_articles', JSON.stringify(articles));
  });

  // Reload page to pick up the new article
  await page.reload({ waitUntil: 'networkidle0' });

  // 2. Scroll to High-Yield Guides section
  await page.evaluate(() => {
    document.getElementById('articles')?.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));

  // Verify the custom article card is visible on homepage
  const customCardFound = await page.evaluate(() => {
    return document.body.textContent.includes('sdgsdghsadgh');
  });
  console.log('Custom article visible in High-Yield Guides:', customCardFound);

  // 3. Click the custom article card to open Reading Modal
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#articles article'));
    const target = cards.find(c => c.textContent && c.textContent.includes('sdgsdghsadgh'));
    if (target) target.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // 4. Verify modal is open with content and NO redirect occurred
  const modalState = await page.evaluate(() => {
    const modal = document.querySelector('.relative.w-full.max-w-3xl');
    return {
      isOpen: !!modal,
      currentUrl: window.location.href,
      modalText: modal ? modal.innerText : '',
    };
  });
  console.log('Modal is open:', modalState.isOpen);
  console.log('Current URL (no redirect):', modalState.currentUrl);
  console.log('Modal contains custom content:', modalState.modalText.includes('High Yield Strategy') && modalState.modalText.includes('sdgsdghsadgh'));

  await page.screenshot({ path: 'C:/Users/hussa/.gemini/antigravity/brain/b5299893-9484-44c5-b1ce-6f4c3e83c39b/article_reading_modal_open.png' });

  // 5. Close the modal using X button
  await page.evaluate(() => {
    const closeBtn = document.querySelector('.relative.w-full.max-w-3xl button[aria-label="Close"]');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  const modalClosed = await page.evaluate(() => {
    return !document.querySelector('.relative.w-full.max-w-3xl');
  });
  console.log('Modal closed via X button:', modalClosed);

  // 6. Test on /articles page as well
  console.log('Testing /articles page...');
  await page.goto('https://osama-aloudat.web.app/articles', { waitUntil: 'networkidle0' });

  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('article'));
    const target = cards.find(c => c.textContent && c.textContent.includes('sdgsdghsadgh'));
    if (target) target.click();
  });
  await new Promise(r => setTimeout(r, 600));

  const articlesPageModalOpen = await page.evaluate(() => {
    return !!document.querySelector('.relative.w-full.max-w-3xl');
  });
  console.log('Modal opens on /articles page:', articlesPageModalOpen);

  await page.screenshot({ path: 'C:/Users/hussa/.gemini/antigravity/brain/b5299893-9484-44c5-b1ce-6f4c3e83c39b/article_modal_on_articles_page.png' });

  await browser.close();
  console.log('All article modal tests completed successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
