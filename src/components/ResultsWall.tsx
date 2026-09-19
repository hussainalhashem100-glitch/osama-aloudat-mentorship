'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Testimonial } from '@/data/content';
import { storage } from '@/lib/storage';
import { Star, ShieldCheck, Award, FileCheck, X, Eye } from 'lucide-react';

interface ResultsWallProps {
  onOpenApply: () => void;
}

export default function ResultsWall({ onOpenApply }: ResultsWallProps) {
  const { t, isAr } = useLanguage();
  const [filter, setFilter] = useState<string>('all');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [selectedScreenshot, setSelectedScreenshot] = useState<{ url: string; student: string; score: string } | null>(null);

  useEffect(() => {
    setTestimonials(storage.getTestimonials());
  }, []);

  const filtered = testimonials.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'step2') return item.track.includes('Step 2');
    if (filter === 'step1') return item.track.includes('Step 1');
    if (filter === 'ifom') return item.track.includes('IFOM');
    if (filter === 'cv') return item.track.includes('CV') || item.track.includes('Match');
    return true;
  });

  return (
    <section id="results" className="py-20 lg:py-24 bg-slate-950 text-white relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
            <Award className="w-3.5 h-3.5" />
            <span>{t('Verified Score Outcomes', 'نتائج حقيقية وموثقة')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            {t('Student Results & Pass Wall', 'حائط نجاحات وعلامات الطلاب')}
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            {t('Real scores from students guided 1:1 by Dr. Osama.', 'علامات حقيقية لأطباء وطلاب بإشراف فردي مباشر.')}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'all', label: t('All Scores', 'جميع النتائج') },
            { id: 'step2', label: 'Step 2 CK (250+)' },
            { id: 'step1', label: 'Step 1 Passes' },
            { id: 'ifom', label: 'IFOM Honors' },
            { id: 'cv', label: 'Medical CV & Match' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                filter === cat.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 scale-105'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 hover:border-cyan-500/40 transition-all hover:-translate-y-1 flex flex-col justify-between space-y-4 shadow-xl group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                    {isAr ? item.trackAr : item.track}
                  </span>
                  <span className="text-sm font-black px-3 py-1 rounded-xl bg-gradient-to-r from-brand-500 to-cyan-500 text-white shadow-md">
                    {item.scoreOrResult}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{isAr ? item.quoteAr : item.quote}"
                </p>

                {/* Verified Score Report / Feedback Button if screenshot exists */}
                {item.screenshotUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedScreenshot({
                        url: item.screenshotUrl!,
                        student: isAr ? item.studentNameAr : item.studentName,
                        score: item.scoreOrResult,
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-800/80 text-cyan-300 text-xs font-bold transition-colors w-full justify-center group-hover:border-cyan-500"
                  >
                    <FileCheck className="w-4 h-4 text-cyan-400" />
                    <span>{t('View Verified Proof / Feedback', 'عرض الإثبات / التقييم الموثق')}</span>
                    <Eye className="w-3.5 h-3.5 ml-1 text-cyan-400" />
                  </button>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${item.avatarBg} text-white font-black text-xs flex items-center justify-center shadow-md`}
                  >
                    {item.studentName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-1">
                      <span>{isAr ? item.studentNameAr : item.studentName}</span>
                      {item.verified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500">{item.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Score Report Lightbox Modal */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            onClick={() => setSelectedScreenshot(null)}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
          />

          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl z-10 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-cyan-400" />
                <span className="text-sm font-bold text-white">
                  {selectedScreenshot.student} — {t('Verified Proof & Score', 'الإثبات والنتيجة الموثقة')} ({selectedScreenshot.score})
                </span>
              </div>
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full aspect-[850/1100] max-h-[75vh] rounded-2xl overflow-hidden border border-slate-800 bg-white">
              <Image
                src={selectedScreenshot.url}
                alt="USMLE Score Report Verification"
                fill
                className="object-contain"
              />
            </div>

            <div className="text-[11px] text-slate-400 text-center">
              {t(
                'Personal identifying information has been redacted to preserve student confidentiality.',
                'تم إخفاء البيانات الشخصية للحفاظ على خصوصية الطالب.'
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
