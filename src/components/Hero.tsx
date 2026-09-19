'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { DOCTOR_PROFILE } from '@/data/content';

interface HeroProps {
  onOpenApply: () => void;
}

export default function Hero({ onOpenApply }: HeroProps) {
  const { t, isAr } = useLanguage();

  return (
    <section className="relative overflow-hidden pt-8 pb-20 lg:pt-14 lg:pb-28 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-brand-600/20 rounded-full blur-[130px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Status Pill */}
        <div className="flex justify-center lg:justify-start mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {t(
                'Accepting Mentees for Upcoming Exam Cycle',
                'استقبال مقاعد جديدة للإرشاد الفردي حالياً'
              )}
            </span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Bold, Brief Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left rtl:lg:text-right">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
              <span className="inline-block">{t('Score 250+.', 'احصل على +250.')}</span>{' '}
              <span className="inline-block whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-brand-400 to-blue-400">
                {t('Pass First Try.', 'وانجح من أول مرة.')}
              </span>
              <span className="text-3xl sm:text-4xl lg:text-5xl text-slate-200 font-extrabold block mt-2">
                {t('1:1 Medical Mentorship.', 'إرشاد طبي فردي ومباشر 1:1.')}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {t(
                'Individualized strategy by Dr. Osama AlOudat (US Pediatric Resident & Top 10 JUST Graduate). Diagnostic assessment, weekly structured blueprint, and direct WhatsApp follow-up.',
                'خطة مخصصة مع د. أسامة عودات (طبيب مقيم بأمريكا وخريج تكنو ضمن العشرة الأوائل). تقييم تشخيصي، جدول أسبوعي منظم، ومتابعة مباشرة عبر واتساب.'
              )}
            </p>

            {/* Quick CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 justify-center lg:justify-start">
              <a
                href="#tracks"
                className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 shadow-xl shadow-brand-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group"
              >
                <Sparkles className="w-5 h-5 text-cyan-200" />
                <span>{t('Explore Mentorship Tracks', 'استعرض برامج الإرشاد')}</span>
                <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isAr ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </a>

              <button
                onClick={onOpenApply}
                className="w-full sm:w-auto px-7 py-4 rounded-full text-sm font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700 transition-all"
              >
                {t('Quick Application', 'تقديم طلب سريع')}
              </button>
            </div>
          </div>

          {/* Right Column: Clean, Stunning Portrait Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md">
              {/* Outer Glow */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-cyan-500 via-brand-600 to-indigo-600 rounded-[2.5rem] blur-2xl opacity-30 -z-10" />

              {/* Photo Card */}
              <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-700/80 bg-slate-900 shadow-2xl">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={DOCTOR_PROFILE.image}
                    alt="Dr. Osama AlOudat, MD"
                    fill
                    priority
                    className="object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                </div>

                {/* Bottom Card Details */}
                <div className="absolute bottom-0 inset-x-0 p-6 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-white">
                      {t(DOCTOR_PROFILE.name, DOCTOR_PROFILE.nameAr)}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] tracking-wider uppercase flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  </div>
                  <p className="text-xs text-cyan-300 font-medium">
                    {t('US Pediatric Resident • Fellow Applicant', 'طبيب مقيم أطفال • متقدم للزمالة بأمريكا')}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {t('Top 10 Class Graduate • JUST Jordan', 'خريج ضمن العشرة الأوائل • تكنو الأردن')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
