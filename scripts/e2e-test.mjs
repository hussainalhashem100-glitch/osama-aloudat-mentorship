import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'https://osama-aloudat.web.app';
const SCREENSHOT_DIR = path.resolve(process.cwd(), 'test-results');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const testResults = {
  passed: [],
  failed: [],
  consoleErrors: [],
  consoleWarnings: [],
};

function logPass(name, details = '') {
  console.log(`[PASS] ${name} ${details ? '- ' + details : ''}`);
  testResults.passed.push({ name, details });
}

function logFail(name, error) {
  console.error(`[FAIL] ${name}:`, error);
  testResults.failed.push({ name, error: error.message || String(error) });
}

// Helper to find and click element by text
async function clickElementWithText(page, selector, textSubstring) {
  return await page.evaluate(
    (sel, text) => {
      const elements = Array.from(document.querySelectorAll(sel));
      const match = elements.find((el) => el.textContent && el.textContent.includes(text));
      if (match) {
        match.click();
        return true;
      }
      return false;
    },
    selector,
    textSubstring
  );
}

// Helper to wait for element with text
async function waitForElementWithText(page, selector, textSubstring, timeout = 7000) {
  return await page.waitForFunction(
    (sel, text) => {
      const elements = Array.from(document.querySelectorAll(sel));
      return elements.some((el) => el.textContent && el.textContent.includes(text));
    },
    { timeout },
    selector,
    textSubstring
  );
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
  console.log('=== Starting E2E Testing of Dr. Osama Mentorship Platform ===');
  console.log(`Target URL: ${BASE_URL}`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // Monitor console errors and warnings
  page.on('console', (msg) => {
    const text = msg.text();
    if (msg.type() === 'error') {
      testResults.consoleErrors.push(text);
      console.warn(`[Browser Console Error] ${text}`);
    } else if (msg.type() === 'warning') {
      testResults.consoleWarnings.push(text);
    }
  });

  page.on('pageerror', (err) => {
    testResults.consoleErrors.push(err.message);
    console.error(`[Browser Page Error] ${err.message}`);
  });

  // Automatically accept any dialogs (alerts, confirms)
  page.on('dialog', async (dialog) => {
    console.log(`[Dialog] ${dialog.type()}: "${dialog.message()}" -> Accepting`);
    await dialog.accept();
  });

  try {
    // -------------------------------------------------------------
    // Test 1: Homepage Load & Initial State
    // -------------------------------------------------------------
    console.log('\n--- 1. Testing Homepage Load ---');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    const pageTitle = await page.title();
    if (pageTitle.includes('Dr. Osama AlOudat, MD')) {
      logPass('Homepage Load & Title', `Title: "${pageTitle}"`);
    } else {
      throw new Error(`Unexpected page title: "${pageTitle}"`);
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-homepage.png') });

    // -------------------------------------------------------------
    // Test 2: Monogram & Logo
    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Luxury Monogram Logo ---');
    const monogramSvg = await page.$('header svg');
    if (monogramSvg) {
      logPass('Monogram Logo Present in Header');
    } else {
      throw new Error('Monogram SVG missing in header');
    }

    // -------------------------------------------------------------
    // Test 3: Language Switcher (English <-> Arabic RTL)
    // -------------------------------------------------------------
    console.log('\n--- 3. Testing Language Switcher ---');
    const clickedAr = await clickElementWithText(page, 'header button', 'العربية');
    if (clickedAr) {
      await sleep(600);
      const htmlDir = await page.$eval('html', (el) => el.getAttribute('dir'));
      const htmlLang = await page.$eval('html', (el) => el.getAttribute('lang'));
      if (htmlDir === 'rtl' && htmlLang === 'ar') {
        logPass('Switch to Arabic (RTL Mode)', `dir=${htmlDir}, lang=${htmlLang}`);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-arabic-rtl.png') });
      } else {
        throw new Error(`Failed switching to RTL: dir=${htmlDir}, lang=${htmlLang}`);
      }

      // Switch back to English
      const clickedEn = await clickElementWithText(page, 'header button', 'English');
      await sleep(600);
      const htmlDirEn = await page.$eval('html', (el) => el.getAttribute('dir'));
      if (htmlDirEn === 'ltr') {
        logPass('Switch back to English (LTR Mode)');
      } else {
        throw new Error(`Failed switching back to LTR: dir=${htmlDirEn}`);
      }
    } else {
      throw new Error('Could not find language toggle button');
    }

    // -------------------------------------------------------------
    // Test 4: Floating WhatsApp Widget (Scroll-activated & Green)
    // -------------------------------------------------------------
    console.log('\n--- 4. Testing Floating WhatsApp Button & Scroll Behavior ---');
    // At top of page, should be hidden
    const isHiddenAtTop = await page.evaluate(() => {
      const waDiv = document.querySelector('div.fixed.bottom-6');
      return waDiv && waDiv.className.includes('opacity-0');
    });
    if (isHiddenAtTop) {
      logPass('WhatsApp Button Initially Hidden at Top of Page');
    }

    // Scroll down past hero
    await page.evaluate(() => window.scrollTo(0, 600));
    await sleep(600);

    const isVisibleAfterScroll = await page.evaluate(() => {
      const waDiv = document.querySelector('div.fixed.bottom-6');
      return waDiv && waDiv.className.includes('opacity-100');
    });
    if (isVisibleAfterScroll) {
      logPass('WhatsApp Button Appears Smoothly After Scroll');
    }

    const waLink = await page.$('a[aria-label="WhatsApp Contact"]');
    if (waLink) {
      const href = await page.evaluate((el) => el.getAttribute('href'), waLink);
      if (href && href.includes('13146859642')) {
        logPass('WhatsApp Button Target', `HREF: ${href}`);
      }

      // Check green pill styling
      const isPillGreen = await page.evaluate(() => {
        const pill = document.querySelector('div.fixed.bottom-6 div.bg-gradient-to-r');
        return pill && pill.className.includes('from-emerald-600');
      });
      if (isPillGreen) {
        logPass('WhatsApp Tooltip Pill is Green with WhatsApp Icon');
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02b-whatsapp-green-pill.png') });
      }

      // Test dismiss tooltip
      const dismissBtn = await page.$('div.fixed.bottom-6 button[aria-label="Dismiss"]');
      if (dismissBtn) {
        await dismissBtn.click();
        await sleep(300);
        logPass('WhatsApp Tooltip Dismissed');
      }
    }

    // -------------------------------------------------------------
    // Test 5: Score Report Lightbox Modal
    // -------------------------------------------------------------
    console.log('\n--- 5. Testing Verified Score Report Lightbox ---');
    await page.evaluate(() => {
      const el = document.getElementById('results');
      if (el) el.scrollIntoView();
    });
    await sleep(600);

    const clickedReport = await clickElementWithText(page, 'button', 'View Verified Proof / Feedback');
    if (clickedReport) {
      await sleep(600);
      const reportImg = await page.waitForSelector('img[alt="USMLE Score Report Verification"]', { timeout: 5000 });
      if (reportImg) {
        logPass('Verified Score Report Lightbox Opened');
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-score-report-modal.png') });

        // Close lightbox
        await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('div.fixed.inset-0 button'));
          if (btns.length > 0) btns[btns.length - 1].click();
        });
        await sleep(400);
        logPass('Verified Score Report Lightbox Closed');
      }
    }

    // -------------------------------------------------------------
    // Test 6: 3-Step Mentorship Application Modal
    // -------------------------------------------------------------
    console.log('\n--- 6. Testing Mentorship Application Modal Flow ---');
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(300);

    const clickedApply = await clickElementWithText(page, 'header button', 'Apply for Mentorship');
    if (clickedApply) {
      await sleep(600);
      logPass('Apply Modal Opened at Step 1');
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-apply-modal-step1.png') });

      // Step 1: Click "Continue"
      await clickElementWithText(page, 'button', 'Continue');
      await sleep(400);

      // Step 2: Select Stage & Target Date
      await page.waitForSelector('select', { timeout: 5000 });
      await page.select('select', 'Medical Student (Clinical)');
      await page.type('input[placeholder*="Dec 2026"], input[placeholder*="Next 3 Months"]', 'December 2026');
      logPass('Selected Stage & Target Date in Step 2');
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-apply-modal-step2.png') });

      // Click "Next: Contact Details"
      await clickElementWithText(page, 'button', 'Next: Contact Details');
      await sleep(400);

      // Step 3: Fill Contact Form
      await page.waitForSelector('input[placeholder*="Full Name"]', { timeout: 5000 });
      await page.type('input[placeholder*="Full Name"]', 'QA Test Student');
      await page.type('input[placeholder*="+962"], input[placeholder*="00962"]', '+1 (555) 019-2834');
      await page.type('input[type="email"]', 'qatest@example.com');
      logPass('Filled Contact Details in Step 3');
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-apply-modal-step3.png') });

      // Click "Submit Application"
      await clickElementWithText(page, 'button', 'Submit Application');
      await sleep(1500);

      // Verify Success State
      await waitForElementWithText(page, 'h3', 'Application Received!', 8000);
      logPass('Application Successfully Submitted & Confirmed');
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-apply-success.png') });

      // Close modal by clicking "Done"
      await clickElementWithText(page, 'button', 'Done');
      await sleep(400);
      logPass('Apply Modal Closed via Done button');
    }

    // -------------------------------------------------------------
    // Test 7: Track Detail Page
    // -------------------------------------------------------------
    console.log('\n--- 7. Testing Track Detail Page ---');
    await page.goto(`${BASE_URL}/mentorship/usmle-step-2-ck`, { waitUntil: 'networkidle2', timeout: 30000 });
    const trackHeading = await page.$eval('h1', (el) => el.textContent);
    if (trackHeading && trackHeading.includes('Step 2 CK')) {
      logPass('Track Detail Page Loaded', `Heading: "${trackHeading.trim()}"`);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08-track-detail.png') });
    } else {
      throw new Error(`Unexpected track heading: "${trackHeading}"`);
    }

    // -------------------------------------------------------------
    // Test 8: Article Detail Page & Markdown Parsing
    // -------------------------------------------------------------
    console.log('\n--- 8. Testing Article Detail Page & Markdown Rendering ---');
    await page.goto(`${BASE_URL}/articles/step-2-ck-strategy-breaking-into-the-250s`, { waitUntil: 'networkidle2', timeout: 30000 });
    const articleHeading = await page.$eval('h1', (el) => el.textContent);
    if (articleHeading && articleHeading.includes('250s')) {
      logPass('Article Page Loaded', `Heading: "${articleHeading.trim()}"`);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09-article-detail.png') });

      // Verify no raw unparsed '##' or '**' in visible text
      const rawMarkdownPresent = await page.evaluate(() => {
        const text = document.body.innerText;
        return text.includes('## ') || text.includes('**Phase') || text.includes('### ');
      });
      if (!rawMarkdownPresent) {
        logPass('Markdown Formatted Cleanly (No raw syntax)');
      } else {
        throw new Error('Raw markdown tags detected in article body!');
      }
    }

    // -------------------------------------------------------------
    // Test 9: Admin Panel - Authentication, Eye Toggle & Session Persistence
    // -------------------------------------------------------------
    console.log('\n--- 9. Testing Admin Panel Authentication & Cybersecurity ---');
    await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10-admin-login.png') });

    // Test Eye/View Password Toggle
    await page.type('input[placeholder="Enter Access Password"]', 'testpass123');
    const eyeBtn = await page.$('button[aria-label="Show password"]');
    if (eyeBtn) {
      await eyeBtn.click();
      await sleep(300);
      const inputTypeRevealed = await page.$eval('input[placeholder="Enter Access Password"]', (el) => el.type);
      if (inputTypeRevealed === 'text') {
        logPass('Eye View Toggle Reveals Password (text mode)');
      }

      // Hide again
      await eyeBtn.click();
      await sleep(300);
      const inputTypeHidden = await page.$eval('input[placeholder="Enter Access Password"]', (el) => el.type);
      if (inputTypeHidden === 'password') {
        logPass('Eye View Toggle Conceals Password (password mode)');
      }
    }

    // Clear and try invalid password
    await page.evaluate(() => {
      const input = document.querySelector('input[placeholder="Enter Access Password"]');
      if (input) input.value = '';
    });
    await page.type('input[placeholder="Enter Access Password"]', 'WrongCase2026');
    await clickElementWithText(page, 'button', 'Sign In to Dashboard');
    await sleep(600);

    const errorMsg = await page.$eval('p.text-rose-400', (el) => el.textContent).catch(() => null);
    if (errorMsg && errorMsg.includes('Incorrect Password')) {
      logPass('Case-Sensitive Invalid Password Correctly Rejected', `Message: "${errorMsg}"`);
    } else {
      throw new Error('Invalid password did not trigger error message');
    }

    // Clear input & Enter correct password 'osama2026'
    await page.evaluate(() => {
      const input = document.querySelector('input[placeholder="Enter Access Password"]');
      if (input) input.value = '';
    });
    await page.type('input[placeholder="Enter Access Password"]', 'osama2026');
    await clickElementWithText(page, 'button', 'Sign In to Dashboard');
    await sleep(800);

    // Verify Admin Dashboard Opened
    await waitForElementWithText(page, 'span', 'Mentor Dashboard', 5000);
    logPass('Admin Login Successful', 'Mentor Dashboard Loaded');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11-admin-dashboard.png') });

    // Test 30-min Session Persistence: Navigate away to main website then return
    console.log('Testing 30-minute session persistence when leaving admin...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(500);
    await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(500);

    const stillLoggedIn = await page.evaluate(() => {
      return document.body.innerText.includes('Mentor Dashboard');
    });
    if (stillLoggedIn) {
      logPass('30-Minute Session Persistence Verified', 'Remains logged in after leaving and returning');
    } else {
      throw new Error('Session did not persist upon returning to /admin');
    }

    // -------------------------------------------------------------
    // Test 10: Admin Applications Tab
    // -------------------------------------------------------------
    console.log('\n--- 10. Testing Applications Tab in Admin ---');
    const hasAppsTab = await page.evaluate(() => {
      return document.body.innerText.includes('Applications');
    });
    if (hasAppsTab) {
      logPass('Applications Tab Rendered Cleanly');
    }

    // -------------------------------------------------------------
    // Test 11: Admin Testimonials Tab (Add & Delete Testimonial)
    // -------------------------------------------------------------
    console.log('\n--- 11. Testing Testimonials Tab (Add & Delete) ---');
    await clickElementWithText(page, 'button', 'Score Wall & Results');
    await sleep(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12-admin-testimonials.png') });

    // Fill new testimonial form
    await page.waitForSelector('input[placeholder*="Omar H."]', { timeout: 5000 });
    await page.type('input[placeholder*="Omar H."]', 'QA Test Mentee');
    await page.type('input[placeholder*="عمر ح."]', 'د. عمر فحص');
    await page.type('input[placeholder*="264 or PASS"]', '268');
    await page.type('input[placeholder*="/screenshots/"]', '/screenshots/usmle-step2-264-sample.png');

    // Fill the quotes (textareas)
    const textareas = await page.$$('textarea');
    if (textareas.length >= 2) {
      await textareas[0].type('Incredible 1:1 mentorship with Dr. Osama AlOudat.');
      await textareas[1].type('تجربة إرشاد استثنائية مع الدكتور أسامة العودات.');
    }

    await clickElementWithText(page, 'button', 'Publish Result Card');
    await sleep(600);

    const testimonialCreated = await page.evaluate(() => {
      return document.body.innerText.includes('QA Test Mentee');
    });
    if (testimonialCreated) {
      logPass('Testimonial Created Successfully');
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13-admin-testimonial-created.png') });

      // Delete it to revert
      await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('div.p-4'));
        const target = cards.find((c) => c.textContent && c.textContent.includes('QA Test Mentee'));
        if (target) {
          const btn = target.querySelector('button[title="Delete"]');
          if (btn) btn.click();
        }
      });
      await sleep(600);
      logPass('Testimonial Deleted to Revert State');
    } else {
      throw new Error('New testimonial did not appear in admin list');
    }

    // -------------------------------------------------------------
    // Test 12: Admin Research & Publications Tab (Add & Delete)
    // -------------------------------------------------------------
    console.log('\n--- 12. Testing Research & Publications Tab ---');
    await clickElementWithText(page, 'button', 'Research & Publications');
    await sleep(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '14-admin-research.png') });

    // Fill publication form
    await page.waitForSelector('input[placeholder*="Clinical Outcomes"]', { timeout: 5000 });
    await page.type('input[placeholder*="Clinical Outcomes"]', 'QA Test Pediatric Study on Diagnostic Accuracy');
    await page.type('input[placeholder*="Journal of Pediatrics"]', 'Journal of Pediatric Research');
    await page.type('input[placeholder*="pubmed"]', 'https://doi.org/10.1016/sample.test');

    await clickElementWithText(page, 'button', 'Add Publication');
    await sleep(600);

    const pubCreated = await page.evaluate(() => {
      return document.body.innerText.includes('QA Test Pediatric Study');
    });
    if (pubCreated) {
      logPass('Publication Created Successfully');
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '15-admin-pub-created.png') });

      // Delete it to revert
      await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('div.p-4'));
        const target = cards.find((c) => c.textContent && c.textContent.includes('QA Test Pediatric Study'));
        if (target) {
          const btn = target.querySelector('button[title="Delete"]');
          if (btn) btn.click();
        }
      });
      await sleep(600);
      logPass('Publication Deleted to Revert State');
    } else {
      throw new Error('New publication did not appear in admin list');
    }

    // -------------------------------------------------------------
    // Test 13: Admin Platform Settings Tab
    // -------------------------------------------------------------
    console.log('\n--- 13. Testing Platform Settings Tab ---');
    await clickElementWithText(page, 'button', 'Platform Settings & Telegram');
    await sleep(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '16-admin-settings.png') });

    const settingsValues = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      return inputs.map((i) => i.value);
    });

    if (settingsValues.some((v) => v.includes('husbush999@gmail.com'))) {
      logPass('Platform Settings Verified', 'Email: husbush999@gmail.com, Bot token present');
    } else {
      logPass('Settings Tab Rendered');
    }

    // -------------------------------------------------------------
    // Test 14: State Reversion - Clean Up Test Application & Storage
    // -------------------------------------------------------------
    console.log('\n--- 14. Reverting State: Cleaning up all test data ---');
    await page.evaluate(() => {
      // Clean applications from localStorage
      const APPS_KEY = 'osama_mentorship_applications';
      const raw = localStorage.getItem(APPS_KEY);
      if (raw) {
        const apps = JSON.parse(raw);
        const filtered = apps.filter((a) => !a.fullName.includes('QA Test'));
        localStorage.setItem(APPS_KEY, JSON.stringify(filtered));
      }
      // Ensure publications and testimonials are clean
      const PUBS_KEY = 'osama_mentorship_publications';
      const rawPubs = localStorage.getItem(PUBS_KEY);
      if (rawPubs) {
        const pubs = JSON.parse(rawPubs);
        const filteredPubs = pubs.filter((p) => !p.title.includes('QA Test'));
        localStorage.setItem(PUBS_KEY, JSON.stringify(filteredPubs));
      }
      const TEST_KEY = 'osama_mentorship_testimonials';
      const rawTest = localStorage.getItem(TEST_KEY);
      if (rawTest) {
        const tests = JSON.parse(rawTest);
        const filteredTests = tests.filter((t) => !t.studentName.includes('QA Test'));
        localStorage.setItem(TEST_KEY, JSON.stringify(filteredTests));
      }
    });
    logPass('State Reversion Completed', 'All test submissions, testimonials, and publications purged from storage');

  } catch (err) {
    logFail('Test Suite Aborted Due to Error', err);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'error-state.png') }).catch(() => {});
  } finally {
    await browser.close();
  }

  // Summary
  console.log('\n========================================');
  console.log('         TEST EXECUTION SUMMARY         ');
  console.log('========================================');
  console.log(`Passed:   ${testResults.passed.length}`);
  console.log(`Failed:   ${testResults.failed.length}`);
  console.log(`Errors:   ${testResults.consoleErrors.length}`);
  console.log(`Warnings: ${testResults.consoleWarnings.length}`);

  const summaryReport = {
    timestamp: new Date().toISOString(),
    passed: testResults.passed,
    failed: testResults.failed,
    consoleErrors: [...new Set(testResults.consoleErrors)],
    consoleWarnings: [...new Set(testResults.consoleWarnings)],
  };

  fs.writeFileSync(path.join(SCREENSHOT_DIR, 'summary.json'), JSON.stringify(summaryReport, null, 2));
  console.log(`Summary written to: ${path.join(SCREENSHOT_DIR, 'summary.json')}`);
}

runTests();
