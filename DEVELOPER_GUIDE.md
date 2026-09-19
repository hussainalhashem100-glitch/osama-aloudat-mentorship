# 👨‍💻 Developer & AI Agent Onboarding Guide

This guide provides practical instructions for software engineers and autonomous AI agents working on the **Dr. Osama AlOudat Mentorship Platform**.

---

## ⚡ Quick Orientation

Before making changes, understand the core constraints of this codebase:
1. **Static Export Environment**: The project uses Next.js 15 App Router configured with `output: 'export'`.
   - **No Node.js Server at Runtime**: Dynamic server-side rendering (SSR), API routes, and Server Actions are **not** supported by the hosting layer.
   - All interactive features (forms, storage, auth, notifications) execute on the client side.
2. **Design Language**:
   - **Palette**: Slate-950 (`#020617`) background, Slate-900 cards, Cyan-400 (`#22d3ee`) primary accents, Brand Blue (`#0284c7`), and Emerald-500 (`#10b981`) success badges.
   - **Typography**: Bold, high-contrast, physician-executive aesthetic with clean rounded corners (`rounded-2xl`, `rounded-3xl`).
   - **Bilingual & RTL**: Every user-facing string must support both English and Arabic via `t('English', 'العربية')` from [`LanguageContext`](./src/context/LanguageContext.tsx).

---

## 🛠️ Common Workflows

### 1. Adding or Modifying a Mentorship Track
Mentorship tracks (e.g., USMLE Step 1, Step 2 CK, IFOM, Medical CV) are defined in:
📁 [`src/data/mentorshipTracks.ts`](./src/data/mentorshipTracks.ts)

To add a new track:
1. Add an entry to `MENTORSHIP_TRACKS` with `id`, `title`, `titleAr`, `badge`, `badgeAr`, `price`, `curriculum`, etc.
2. If static track detail pages are used, ensure `src/app/mentorship/[track]/page.tsx` returns the new track ID in `generateStaticParams()`.
3. The track will automatically populate in:
   - The homepage Mentorship section ([`MentorshipSection.tsx`](./src/components/MentorshipSection.tsx))
   - The 3-step application modal ([`ApplyModal.tsx`](./src/components/ApplyModal.tsx))
   - The navigation dropdown ([`Navbar.tsx`](./src/components/Navbar.tsx))

### 2. Updating Default Content
Default seed data for testimonials, articles, and free resources is located in:
📁 [`src/data/content.ts`](./src/data/content.ts)

- **Testimonials**: Add entries to `TESTIMONIALS` with student name, exam score, review quote, and optional `screenshotUrl`.
- **Articles**: Add entries to `ARTICLES` with `slug`, `title`, `titleAr`, `excerpt`, `content` (markdown), and `readTime`.

### 3. Modifying Admin Authentication & Security
Admin credentials and session parameters are configured in:
📁 [`src/lib/storage.ts`](./src/lib/storage.ts)

- **Salt**: `PASSWORD_SALT = 'osama_aloudat_med_secure_salt_2026'`
- **Default Password**: `osama2026` (Hashed: `ed970cbd0a2a7b55b2d87a2f71f4f94e09396f004e26e34e9c36b7826666d11d`)
- **Lockout Threshold**: `MAX_FAILED_ATTEMPTS = 5`
- **Lockout Duration**: `LOCKOUT_DURATION_MS = 30 * 1000` (30 seconds)
- **Session Duration**: `SESSION_DURATION_MS = 30 * 60 * 1000` (30 minutes)

To change the default password programmatically:
```ts
const hash = await hashPassword('yourNewPassword');
localStorage.setItem('osama_admin_password_hash', hash);
```

### 4. Updating Site Settings & Telegram Dispatch
Site settings (WhatsApp number, contact email, Telegram bot token, chat ID) can be updated:
1. Via the **Admin Panel** at `/admin` (recommended).
2. By updating `DEFAULT_SETTINGS` in [`src/lib/storage.ts`](./src/lib/storage.ts).

---

## ⚠️ Important Rules for AI Agents

When making code edits, you **must** follow these rules:

### A. Modal Component Design Rules
When creating or editing modal components (e.g., `ApplyModal.tsx`, `ArticleModal.tsx`, score report lightboxes):
1. **Visibility Guard**: Always include `if (!isOpen) return null;` at the top of the render block. Without this, React continues to render the modal DOM even when `isOpen === false`.
2. **Explicit Button Types**: Always add `type="button"` to close buttons and navigation buttons to prevent inadvertent form submissions.
3. **Z-Index & Cursor**: Modal overlays should use `z-50`, backdrops `cursor-pointer`, and close buttons `z-30 cursor-pointer`.
4. **Body Scroll Lock**: Always lock `document.body.style.overflow = 'hidden'` when the modal is open, and restore it on close/unmount.

### B. Dynamic Content on Static Hosting
- **Do NOT rely on dynamic server slugs (`[slug]`) for runtime user-generated content**: On Firebase static hosting, slugs not present at `npm run build` time will fall back to `/index.html` via rewrite rules.
- **Use In-Page Lightboxes/Modals**: Use the established `ArticleModal.tsx` pattern for viewing dynamic runtime content.

---

## 🧪 Running the Test Suite

We maintain automated headless Chrome E2E test scripts using Puppeteer:

```bash
# 1. Test Article Reading Lightbox Modal
node scripts/test-article-modal.mjs

# 2. Test Mentorship Application Step 1 Selection & Continue Flow
node scripts/test-track-selection.mjs

# 3. Test Close Buttons & Backdrop Dismissal
node scripts/test-close-btn.mjs
```

### Writing a New Test Script
Place all new test scripts in `scripts/` using `.mjs` (ES Modules). Follow this template:
```js
import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage();
  await page.goto('https://osama-aloudat.web.app', { waitUntil: 'networkidle0' });

  // Test assertions...

  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
```

---

## 🚀 Deployment Checklist

Before and after making changes, follow this checklist:
1. **Typecheck & Build**:
   ```bash
   npm run build
   ```
   Ensure the build completes with exit code 0 and all 13 static pages are generated.
2. **Run Verification Script**:
   Execute the relevant test script in `scripts/` to verify functionality.
3. **Deploy to Firebase Hosting**:
   ```bash
   npx firebase deploy --only hosting
   ```
4. **Live Verification**:
   Inspect [https://osama-aloudat.web.app](https://osama-aloudat.web.app) in your browser.
5. **Document Major Checkpoints**:
   Update `checkpoint.md` in the root directory.
