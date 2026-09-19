'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Instagram, Mail, Copy, Check, ExternalLink, X, Send } from 'lucide-react';
import { DOCTOR_PROFILE, MENTORSHIP_TRACKS } from '@/data/content';
import { storage } from '@/lib/storage';
import Logo from '@/components/Logo';

export default function Footer() {
  const { t, isAr } = useLanguage();
  const [email, setEmail] = useState('husbush999@gmail.com');
  const [instagram, setInstagram] = useState(DOCTOR_PROFILE.instagram);
  const [isEmailMenuOpen, setIsEmailMenuOpen] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  useEffect(() => {
    const settings = storage.getSettings();
    if (settings.email) setEmail(settings.email);
    if (settings.instagram) setInstagram(settings.instagram);
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch (e) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    setIsEmailMenuOpen(false);
    setShowCopiedToast(true);
    setTimeout(() => {
      setShowCopiedToast(false);
    }, 2800);
  };

  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    email
  )}&su=${encodeURIComponent('Medical Mentorship Inquiry - Dr. Osama AlOudat')}`;

  const defaultMailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
    'Medical Mentorship Inquiry - Dr. Osama AlOudat'
  )}`;

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 relative">
      {/* Centered screen message when email is copied */}
      {showCopiedToast && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200"
          onClick={() => setShowCopiedToast(false)}
        >
          <div
            className="bg-slate-900 border-2 border-emerald-500/80 shadow-2xl shadow-emerald-950/70 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-3 ring-4 ring-emerald-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shadow-inner">
              <Check className="w-9 h-9 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                {t('Email Copied to Clipboard!', 'تم نسخ البريد الإلكتروني!')}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {t('You can now paste it into any email app.', 'يمكنك الآن لصقه في أي تطبيق بريد.')}
              </p>
            </div>
            <div className="text-xs font-mono text-cyan-300 bg-slate-950/90 py-2 px-3 rounded-xl border border-slate-800 break-all select-all font-semibold">
              {email}
            </div>
            <button
              type="button"
              onClick={() => setShowCopiedToast(false)}
              className="mt-2 w-full py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              {t('Close', 'إغلاق')}
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1 & 2: Brand & Bio */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <Logo size={40} />
              <div>
                <span className="text-base font-bold text-white tracking-tight">
                  {t(DOCTOR_PROFILE.name, DOCTOR_PROFILE.nameAr)}
                </span>
                <p className="text-[11px] text-cyan-400 font-medium">
                  {t('1:1 Medical Mentorship & USMLE Prep', 'إرشاد طبي فردي 1:1 وتحضير USMLE')}
                </p>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              {t(
                'Personalized medical mentorship for medical students and IMGs aiming to excel in USMLE Step 1, Step 2 CK, IFOM, and the US Residency Match.',
                'إرشاد طبي فردي ومباشر لطلاب الطب وخريجي الجامعات الدولية الراغبين في التفوق بامتحانات USMLE و IFOM والقبول في برامج الإقامة الأمريكية.'
              )}
            </p>
            <div className="flex items-center gap-3 pt-1 relative">
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-cyan-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              {/* Interactive Email Button & Popover */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsEmailMenuOpen((prev) => !prev)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${
                    isEmailMenuOpen
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30'
                      : 'bg-slate-900 hover:bg-cyan-600 text-slate-300 hover:text-white border-slate-800'
                  }`}
                  aria-label="Email Options"
                  title={email}
                >
                  <Mail className="w-4 h-4" />
                </button>

                {/* Email Action Menu Popover */}
                {isEmailMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setIsEmailMenuOpen(false)}
                    />
                    <div className="absolute bottom-full mb-3 left-0 sm:left-auto rtl:left-auto rtl:right-0 z-40 w-72 sm:w-80 p-4 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-cyan-950/80 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-cyan-400" />
                          {t('Contact via Email', 'التواصل عبر البريد')}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsEmailMenuOpen(false)}
                          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Display email address */}
                      <div className="text-[11px] font-mono text-cyan-300 bg-slate-950 py-1.5 px-2.5 rounded-lg border border-slate-800 break-all select-all">
                        {email}
                      </div>

                      <div className="space-y-1.5 pt-1">
                        {/* 1. Open in Gmail */}
                        <a
                          href={gmailComposeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsEmailMenuOpen(false)}
                          className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-between transition-colors border border-slate-700/50 group"
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            <span>{t('Open in Gmail', 'فتح في Gmail')}</span>
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                        </a>

                        {/* 2. Copy Email Address */}
                        <button
                          type="button"
                          onClick={handleCopyEmail}
                          className="w-full py-2 px-3 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-200 hover:text-white font-semibold text-xs flex items-center justify-between transition-colors border border-cyan-700/40 group"
                        >
                          <span className="flex items-center gap-2">
                            <Copy className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{t('Copy Email Address', 'نسخ عنوان البريد')}</span>
                          </span>
                          <span className="text-[10px] uppercase font-bold text-cyan-400 group-hover:text-white">
                            {t('1-Tap', 'بنقرة واحدة')}
                          </span>
                        </button>

                        {/* 3. Default Mail App */}
                        <a
                          href={defaultMailtoUrl}
                          onClick={() => setIsEmailMenuOpen(false)}
                          className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs flex items-center justify-between transition-colors border border-slate-800/60"
                        >
                          <span className="flex items-center gap-2">
                            <Send className="w-3 h-3 text-slate-500" />
                            <span>{t('Default Mail App', 'تطبيق البريد الافتراضي')}</span>
                          </span>
                          <span className="text-[10px] text-slate-500">mailto</span>
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Col 3: Tracks */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {t('Mentorship Tracks', 'برامج الإرشاد')}
            </h4>
            <ul className="space-y-2">
              {MENTORSHIP_TRACKS.map((track) => (
                <li key={track.id}>
                  <Link
                    href={`/mentorship/${track.slug}`}
                    className="hover:text-cyan-300 transition-colors"
                  >
                    {isAr ? track.titleAr : track.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {t('Platform', 'المنصة')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#results" className="hover:text-cyan-300 transition-colors">
                  {t('Student Results', 'نتائج الطلاب')}
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-cyan-300 transition-colors">
                  {t('About Dr. Osama', 'عن الدكتور أسامة')}
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-cyan-300 transition-colors">
                  {t('Articles & Guides', 'المقالات والأدلة')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Disclaimer & Copyright */}
        <div className="mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500">
          <p className="text-[11px] text-center sm:text-left rtl:sm:text-right">
            © {new Date().getFullYear()} {t('Dr. Osama AlOudat, MD. All rights reserved.', 'د. أسامة عودات. جميع الحقوق محفوظة.')}
          </p>
          <p className="text-[10px] text-slate-600 text-center sm:text-right rtl:sm:text-left max-w-md">
            {t(
              'Educational guidance and mentorship. USMLE® is a registered trademark of the NBME and FSMB.',
              'محتوى إرشادي وتعليمي. USMLE® هي علامة تجارية مسجلة لهيئة NBME و FSMB.'
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
