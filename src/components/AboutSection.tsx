'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { DOCTOR_PROFILE } from '@/data/content';
import { storage, Publication } from '@/lib/storage';
import { GraduationCap, Building2, Stethoscope, Instagram, BookMarked, ExternalLink } from 'lucide-react';

export default function AboutSection() {
  const { t, isAr } = useLanguage();
  const [publications, setPublications] = useState<Publication[]>([]);

  useEffect(() => {
    setPublications(storage.getPublications());
  }, []);

  return (
    <section id="about" className="py-20 lg:py-24 bg-slate-900 text-white relative overflow-hidden border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Photo Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="relative rounded-3xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-950">
                <div className="relative aspect-square w-full">
                  <Image
                    src={DOCTOR_PROFILE.image}
                    alt="Dr. Osama AlOudat, MD"
                    fill
                    className="object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                </div>

                <div className="p-5 text-center space-y-2">
                  <h3 className="text-xl font-black text-white">
                    {t(DOCTOR_PROFILE.name, DOCTOR_PROFILE.nameAr)}
                  </h3>
                  <p className="text-xs text-cyan-300 font-semibold">
                    {t('US Pediatric Resident • Fellow Applicant', 'طبيب مقيم أطفال • متقدم للزمالة بأمريكا')}
                  </p>
                  <a
                    href={DOCTOR_PROFILE.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
                  >
                    <Instagram className="w-3.5 h-3.5 text-pink-400" />
                    <span>{DOCTOR_PROFILE.instagramHandle}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Brief Story & Credibility */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left rtl:lg:text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider border border-brand-500/30">
              <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('About Dr. Osama AlOudat', 'عن الدكتور أسامة عودات')}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              {t('From Jordan to the US Residency.', 'مسيرة من كليات الأردن إلى الإقامة بأمريكا.')}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              {t(
                'Graduated in the top 10 from Jordan University of Science and Technology (JUST), completed 2 years of pediatric residency at King Abdullah University Hospital (KAUH), and matched into US pediatric residency.',
                'تخرج ضمن العشرة الأوائل من جامعة العلوم والتكنولوجيا الأردنية (تكنو)، وأتم عامين من الإقامة بمستشفى الملك المؤسس، ثم المطابقة بنجاح في برامج الإقامة الأمريكية.'
              )}
            </p>

            <p className="text-sm sm:text-base text-cyan-300 font-medium leading-relaxed">
              {t(
                '“I founded this 1:1 mentorship to cut the noise. You don’t need generic advice—you need an individualized diagnostic audit, an exact weekly plan, and daily WhatsApp voice accountability.”',
                '«أنشأت هذا البرنامج لإنهاء التشتت؛ لا تحتاج لنصائح عامة، بل لتقييم دقيق لمستواك، خطة أسبوعية محكمة، ومتابعة يومية مباشرة.»'
              )}
            </p>

            {/* 3 Quick Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-cyan-400 flex items-center justify-center lg:justify-start gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  <span>JUST Jordan</span>
                </div>
                <div className="text-xs text-slate-300 font-medium">Top 10 Class Graduate</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-brand-400 flex items-center justify-center lg:justify-start gap-1.5">
                  <Building2 className="w-4 h-4" />
                  <span>KAUH Hospital</span>
                </div>
                <div className="text-xs text-slate-300 font-medium">2 Yrs Pediatric Residency</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-xs font-bold text-emerald-400 flex items-center justify-center lg:justify-start gap-1.5">
                  <Stethoscope className="w-4 h-4" />
                  <span>United States</span>
                </div>
                <div className="text-xs text-slate-300 font-medium">Pediatric Resident & Fellow</div>
              </div>
            </div>
          </div>
        </div>

        {/* Research & Publications (Renders only if publications exist) */}
        {publications.length > 0 && (
          <div className="pt-8 border-t border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <BookMarked className="w-4 h-4" />
              <span>{t('Research & Academic Publications', 'الأبحاث والمنشورات الأكاديمية')}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {publications.map((pub) => (
                <div
                  key={pub.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white leading-snug">
                      {isAr && pub.titleAr ? pub.titleAr : pub.title}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {pub.journal} • {pub.year}
                    </p>
                  </div>
                  {pub.link && (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 transition-colors shrink-0"
                      title="View publication"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
