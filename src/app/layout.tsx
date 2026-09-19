import type { Metadata } from 'next';
import { Inter, Cairo } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Dr. Osama AlOudat, MD | 1:1 Medical Mentorship & USMLE Prep',
  description:
    'Individualized 1:1 medical mentorship for USMLE Step 1, Step 2 CK (250+), IFOM, and Medical CV by Dr. Osama AlOudat, MD. Transform your study strategy and match into US residency.',
  keywords: [
    'USMLE Step 1',
    'USMLE Step 2 CK',
    'IFOM',
    'Medical CV',
    'US Residency Match',
    'IMG Mentorship',
    'Osama AlOudat',
    'Medical Education'
  ],
  authors: [{ name: 'Dr. Osama AlOudat, MD' }],
  openGraph: {
    title: 'Dr. Osama AlOudat, MD | 1:1 Medical Mentorship',
    description:
      'Personalized 1:1 mentorship for USMLE Step 1, Step 2 CK, IFOM, and Medical CV. Proven strategies to score 250+ and match.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className={`${inter.variable} ${cairo.variable}`}>
      <body className="font-sans antialiased text-slate-900 bg-slate-50 selection:bg-brand-500 selection:text-white">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
