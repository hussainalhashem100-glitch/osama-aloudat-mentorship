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
  await page.goto('https://osama-aloudat.web.app/admin', { waitUntil: 'networkidle0' });

  // Add dummy applications to localStorage
  await page.evaluate(() => {
    const apps = [
      {
        id: 'test_1',
        fullName: 'Hussain Al-Hashem',
        email: 'hussain@example.com',
        whatsapp: '+962 795770421',
        trackId: 'step2',
        trackTitle: 'USMLE Step 2 CK',
        currentStage: 'Medical Student (Clinical)',
        targetExamDate: 'May 2027',
        status: 'new',
        submittedAt: new Date().toISOString(),
      },
      {
        id: 'test_2',
        fullName: 'Dr. Tariq S.',
        email: 'tariq@example.com',
        whatsapp: '+966 501234567',
        trackId: 'step1',
        trackTitle: 'USMLE Step 1',
        currentStage: 'Medical Graduate / Resident',
        targetExamDate: 'Dec 2026',
        status: 'contacted',
        submittedAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem('osama_mentorship_applications', JSON.stringify(apps));
  });

  // Reload to let React state initialize with the localStorage data
  await page.reload({ waitUntil: 'networkidle0' });

  // Login
  const passInput = await page.waitForSelector('input');
  await passInput.type('osama2026');
  await page.evaluate(() => {
    const btn = document.querySelector('button[type="submit"]');
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  // Screenshot table with delete buttons
  const screenshotPath = path.join(ARTIFACTS_DIR, 'admin_applications_with_delete_btn.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Saved screenshot to', screenshotPath);

  await browser.close();
  console.log('Verification finished successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
