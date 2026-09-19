'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles, Globe, Menu, X, ChevronDown } from 'lucide-react';
import { MENTORSHIP_TRACKS, DOCTOR_PROFILE } from '@/data/content';
import Logo from '@/components/Logo';

interface NavbarProps {
  onOpenApply: (trackId?: string) => void;
}

export default function Navbar({ onOpenApply }: NavbarProps) {
  const { lang, toggleLang, t, isAr } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tracksDropdownOpen, setTracksDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Mark */}
          <Link href="/" className="flex items-center gap-3 group">
            <Logo size={42} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                  {t(DOCTOR_PROFILE.name, DOCTOR_PROFILE.nameAr)}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800">
                  MD
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                {t('1:1 Medical Mentorship & USMLE', 'إرشاد طبي فردي 1:1 و USMLE')}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {/* Tracks Dropdown */}
            <div className="relative">
              <button
                onClick={() => setTracksDropdownOpen(!tracksDropdownOpen)}
                onMouseEnter={() => setTracksDropdownOpen(true)}
                className="flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-cyan-300 rounded-lg transition-colors"
              >
                <span>{t('Mentorship Tracks', 'برامج الإرشاد')}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${tracksDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {tracksDropdownOpen && (
                <div
                  onMouseLeave={() => setTracksDropdownOpen(false)}
                  className={`absolute top-full mt-1 w-64 bg-slate-900 rounded-2xl p-2 shadow-2xl border border-slate-800 z-50 animate-in fade-in slide-in-from-top-2 ${
                    isAr ? 'right-0' : 'left-0'
                  }`}
                >
                  {MENTORSHIP_TRACKS.map((track) => (
                    <Link
                      key={track.id}
                      href={`/mentorship/${track.slug}`}
                      onClick={() => setTracksDropdownOpen(false)}
                      className="block p-2.5 rounded-xl hover:bg-slate-800 transition-colors group"
                    >
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300">
                        {isAr ? track.titleAr : track.title}
                      </div>
                      <div className="text-[10px] text-cyan-400 font-semibold mt-0.5">
                        {isAr ? track.badgeAr : track.badge}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/#results"
              className="px-3 py-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-cyan-300 rounded-lg transition-colors"
            >
              {t('Student Results', 'نتائج الطلاب')}
            </Link>

            <Link
              href="/#about"
              className="px-3 py-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-cyan-300 rounded-lg transition-colors"
            >
              {t('About Dr. Osama', 'عن الدكتور')}
            </Link>

            <Link
              href="/articles"
              className="px-3 py-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-cyan-300 rounded-lg transition-colors"
            >
              {t('Articles & Guides', 'المقالات والأدلة')}
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all hover:scale-105"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Apply Button */}
            <button
              onClick={() => onOpenApply()}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 shadow-md shadow-brand-500/20 transition-all"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>{t('Apply for Mentorship', 'تقديم طلب الإرشاد')}</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-800"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {MENTORSHIP_TRACKS.map((track) => (
              <Link
                key={track.id}
                href={`/mentorship/${track.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-200 hover:bg-slate-900"
              >
                {isAr ? track.titleAr : track.title}
              </Link>
            ))}
            <Link
              href="/#results"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-200 hover:bg-slate-900"
            >
              {t('Student Results', 'نتائج الطلاب')}
            </Link>
            <Link
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-200 hover:bg-slate-900"
            >
              {t('About Dr. Osama', 'عن الدكتور')}
            </Link>
            <Link
              href="/articles"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-200 hover:bg-slate-900"
            >
              {t('Articles & Guides', 'المقالات والأدلة')}
            </Link>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenApply();
              }}
              className="w-full py-3 rounded-xl text-center text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md"
            >
              {t('Apply for 1:1 Mentorship', 'تقديم طلب الإرشاد')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
