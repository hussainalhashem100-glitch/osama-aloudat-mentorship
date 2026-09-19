# 🩺 Dr. Osama AlOudat, MD — 1:1 Medical Mentorship & USMLE Strategy Platform

[![Live Production](https://img.shields.io/badge/Production-Live%20on%20Firebase-00c853?style=for-the-badge&logo=firebase)](https://osama-aloudat.web.app)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

The official web platform for **Dr. Osama AlOudat, MD** (US Pediatric Resident, Top 10 JUST Graduate, USMLE Step 1 & 2 CK 250+ Mentor). 

This platform delivers an end-to-end digital experience for medical students and international medical graduates (IMGs) seeking high-yield clinical mentorship, structured study blueprints, and direct WhatsApp voice accountability for **USMLE Step 1**, **USMLE Step 2 CK**, **IFOM (BSE & CSE)**, and the **US Residency Match / Medical CV**.

- **🌐 Live Production Website**: [https://osama-aloudat.web.app](https://osama-aloudat.web.app)
- **🔐 Admin Portal**: [https://osama-aloudat.web.app/admin](https://osama-aloudat.web.app/admin)

---

## 🚀 Key Features

### 1. 📋 1:1 Mentorship Application Wizard
- **3-Step Intuitive Flow**:
  - **Step 1 (Program Selection)**: Choose between *USMLE Step 1*, *USMLE Step 2 CK*, *IFOM*, or *Medical CV & ERAS*. Clicking an option selects it with glowing indicators; clicking "Continue" advances to Step 2.
  - **Step 2 (Timeline & Stage)**: Touch-friendly year stepper (`2024` to `2039+`) and 1-tap month swapper (`Jan` to `Dec`) for target exam date selection, along with current training stage.
  - **Step 3 (Contact & Phone Normalization)**: Integrated country code picker (`src/data/countries.ts`) with international dial codes, smart leading-zero stripping, and live normalized preview badge (`+962 795770421`).
- **Instant Telegram Bot Dispatch**: Submitting an application immediately triggers a real-time message to Dr. Osama's Telegram bot (`@Osama_Ped_bot`) with applicant name, track, phone, email, and target date.
- **Confetti Celebration**: Smooth visual celebration using `canvas-confetti`.

### 2. 🏆 Student Results Wall & Proof Lightbox
- High-contrast student testimonials featuring verified scores (e.g., `264`, `258`, `252`, `Pass First Try`).
- **Verified Score Report Lightbox**: Interactive modal lightbox displaying official score sheet proof with confidentiality redactions.
- **Client-Side Proof Upload**: The Admin panel allows Dr. Osama to upload images with automatic client-side canvas compression.

### 3. 📖 Knowledge Hub & In-Page Article Reading Lightbox
- High-yield medical guides and strategy articles with bilingual support (English / Arabic).
- **In-Page Reading Modal (`ArticleModal.tsx`)**: Clicking any article on the homepage or `/articles` opens an instant, distraction-free reading lightbox with live markdown rendering (headers, bullet points, bold/italic), eliminating static-hosting page redirects.
- **In-Article Mentorship CTA**: Direct conversion card inside every article linking back to the mentorship application modal.

### 4. 🎨 Luxury Physician Geometric Monogram
- Custom SVG monogram (`OA`) enclosed in a cyan-to-sapphire gradient shield with an emerald vertex accent.
- Integrated into the sticky Navbar and Footer for clean brand identity.

### 5. 💬 Scroll-Activated Floating WhatsApp Widget
- Authentic emerald green WhatsApp pill with direct link to Dr. Osama's WhatsApp (`+1 (314) 685-9642`).
- Scroll-activated: smoothly reveals only after the user scrolls down past the hero and curriculum to the High-Yield Guides section (`#articles`).

### 6. 🛡️ Cybersecurity & Admin Authentication
- **Cryptographic Password Protection**: SHA-256 password hashing with a private salt using the browser's Web Crypto API (`crypto.subtle.digest`).
- **Brute-Force Rate Limiting**: 5 failed login attempts trigger an automatic 30-second lockout with a live countdown timer.
- **Inactivity Session Lock**: Automatic logout after 30 minutes of inactivity.
- **Password Visibility Toggle**: Interactive show/hide eye toggle for login and password change forms.

### 7. ⚙️ Full-Featured Admin Panel (`/admin`)
- **Applications Management**: View all submitted applications with applicant details, 1-click WhatsApp chat deep-links, and individual deletion with two-step confirmation.
- **Testimonials & Proof**: Add, edit, and delete student reviews with optional score report image uploads.
- **Research & Publications**: Add, edit, and delete Dr. Osama's peer-reviewed research papers (conditionally rendered on the public site).
- **Articles & Guides**: Publish and manage articles with markdown support.
- **Site Settings**: Dynamically update contact email, WhatsApp number, Instagram link, Telegram Bot Token, and Chat ID without redeployment.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, Static HTML Export) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Animations & FX** | `canvas-confetti` |
| **Cryptography** | Web Crypto API (`crypto.subtle`) |
| **Hosting** | [Google Firebase Hosting](https://firebase.google.com/docs/hosting) |
| **Testing** | [Puppeteer Core](https://pptr.dev/) (Automated headless Chrome E2E tests) |

---

## 📂 Project Structure

```
├── public/                     # Static assets & sample score reports
│   └── screenshots/            # Verified score report sample images
├── scripts/                    # Automated Puppeteer E2E testing suite
│   ├── test-article-modal.mjs  # Article reading lightbox verification
│   ├── test-close-btn.mjs      # Modal dismissal & backdrop tests
│   ├── test-modal-full.mjs     # Multi-step application wizard tests
│   └── test-track-selection.mjs# Step 1 selection & continue flow tests
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/              # Admin Portal (/admin)
│   │   ├── articles/           # High-Yield Guides (/articles & /articles/[slug])
│   │   ├── mentorship/         # Track detail pages (/mentorship/[track])
│   │   ├── layout.tsx          # Root layout & font configurations
│   │   └── page.tsx            # Main Landing Page
│   ├── components/             # Reusable UI components
│   │   ├── ApplyModal.tsx      # 3-step mentorship application modal
│   │   ├── ArticleModal.tsx    # In-page article reading lightbox
│   │   ├── ArticlesSection.tsx # High-yield guides homepage section
│   │   ├── Footer.tsx          # Footer with monogram & email popover
│   │   ├── HeroSection.tsx     # Hero section with doctor badge & CTA
│   │   ├── MentorshipSection.tsx# Mentorship tracks & FAQ accordion
│   │   ├── Navbar.tsx          # Sticky navigation with luxury monogram
│   │   ├── ResultsWall.tsx     # Testimonials & score report lightbox
│   │   └── WhatsAppWidget.tsx  # Scroll-activated WhatsApp pill
│   ├── context/
│   │   └── LanguageContext.tsx # English/Arabic bilingual context & helpers
│   ├── data/
│   │   ├── content.ts          # Default testimonials, articles & resources
│   │   ├── countries.ts        # Country codes, flags & dial codes
│   │   └── mentorshipTracks.ts # Step 1, Step 2 CK, IFOM, CV tracks data
│   └── lib/
│       └── storage.ts          # Client-side persistence, hashing & Telegram dispatcher
├── firebase.json               # Firebase Hosting configuration & rewrites
├── next.config.ts              # Next.js configuration (output: 'export')
├── package.json                # Project dependencies & scripts
├── tailwind.config.ts          # Tailwind styling & color tokens
└── tsconfig.json               # TypeScript compiler options
```

---

## 💻 Getting Started

### Prerequisites
- **Node.js**: v18.18.0 or newer (v20+ recommended)
- **npm**: v9.0.0 or newer
- **Google Chrome**: (Optional, for running automated Puppeteer tests)

### 1. Installation
```bash
git clone https://github.com/hussainalhashem100-glitch/osama-aloudat-mentorship.git
cd osama-aloudat-mentorship
npm install
```

### 2. Local Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build & Static Export
```bash
npm run build
```
This produces an optimized static HTML/CSS/JS export in the `out/` directory.

### 4. Deploying to Firebase Hosting
```bash
# Login to Firebase (first-time only)
npx firebase login

# Deploy static export to production
npx firebase deploy --only hosting
```

---

## 🧪 Automated Testing

The project includes an end-to-end automated testing suite powered by Puppeteer:

```bash
# Test modal dismissal and backdrop clicks
node scripts/test-close-btn.mjs

# Test article reading lightbox modal with custom articles
node scripts/test-article-modal.mjs

# Test mentorship application selection & explicit continue
node scripts/test-track-selection.mjs
```

---

## 🔒 Security & Privacy

- **No Server Secrets Leaked**: The application is a static client-side build. All admin operations use salted SHA-256 hashes stored in browser storage.
- **Confidentiality Redaction**: Student identification numbers on score report screenshots are redacted before public display.
- **Telegram Webhook Security**: Bot tokens can be updated dynamically in the Admin Settings tab without requiring code redeployment.

---

## 📄 License & Attribution

Designed and developed for **Dr. Osama AlOudat, MD**. All rights reserved.
For architectural details and developer onboarding, see [`ARCHITECTURE.md`](./ARCHITECTURE.md) and [`DEVELOPER_GUIDE.md`](./DEVELOPER_GUIDE.md).
