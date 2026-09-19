'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { MENTORSHIP_TRACKS } from '@/data/content';
import { CheckCircle2, ArrowRight, Sparkles, Award, Zap, HelpCircle, ChevronDown, Check } from 'lucide-react';

interface MentorshipSectionProps {
  onOpenApply: (trackId?: string) => void;
}

export default function MentorshipSection({ onOpenApply }: MentorshipSectionProps) {
  const { t, isAr } = useLanguage();
  const [selectedId, setSelectedId] = useState<string>('step2ck');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const activeTrack = MENTORSHIP_TRACKS.find((tr) => tr.id === selectedId) || MENTORSHIP_TRACKS[0];

  return (
    <section id="tracks" className="py-20 lg:py-24 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-cyan-300 text-xs font-black uppercase tracking-wider border border-brand-500/30">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t('Strictly 1:1 Mentorship', 'إرشاد فردي 1:1 حصرياً')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            {t('Choose Your Mentorship Track', 'اختر مسار الإرشاد المخصص')}
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            {t(
              'No generic courses. Built entirely around your diagnostic baseline and target exam date.',
              'بدون دورات عامة؛ مصمم خصيصاً وفق تقييم مستواك وموعد امتحانك.'
            )}
          </p>
        </div>

        {/* Track Switcher Pills */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {MENTORSHIP_TRACKS.map((tr) => {
            const isSelected = tr.id === selectedId;
            return (
              <button
                key={tr.id}
                onClick={() => {
                  setSelectedId(tr.id);
                  setOpenFaq(null);
                }}
                className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-brand-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/20 scale-105'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                <span>{isAr ? tr.titleAr : tr.title}</span>
                {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-300 animate-ping" />}
              </button>
            );
          })}
        </div>

        {/* Active Track Bento Card */}
        <div className="mt-10 rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Brief details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-bold border border-cyan-500/20">
                  <Award className="w-3.5 h-3.5" />
                  <span>{isAr ? activeTrack.badgeAr : activeTrack.badge}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {isAr ? activeTrack.titleAr : activeTrack.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-300 font-medium">
                  {isAr ? activeTrack.taglineAr : activeTrack.tagline}
                </p>
              </div>

              {/* What You Get Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t('What You Get:', 'ما يشمله البرنامج:')}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(isAr ? activeTrack.whatYouGetAr : activeTrack.whatYouGet).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2.5 text-xs sm:text-sm text-slate-200"
                    >
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4-Step Process Bar */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t('4-Step Execution:', 'خطة التنفيذ في ٤ خطوات:')}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {activeTrack.process.map((pr, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
                      <div className="text-xs font-black text-cyan-400">{isAr ? pr.stepAr : pr.step}</div>
                      <div className="text-xs font-bold text-white line-clamp-1">{isAr ? pr.titleAr : pr.title}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-2">{isAr ? pr.descAr : pr.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Score Outcome & CTA */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6 h-full">
              {/* Highlight Result Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-950 via-slate-900 to-slate-950 border border-brand-500/30 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest">
                    {t('Verified Mentee Result', 'نتيجة موثقة لأحد الطلاب')}
                  </span>
                  <span className="text-2xl font-black text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-xl border border-cyan-800">
                    {activeTrack.highlightResult.score}
                  </span>
                </div>
                <p className="text-sm text-slate-200 italic leading-snug">
                  "{isAr ? activeTrack.highlightResult.textAr : activeTrack.highlightResult.text}"
                </p>
                <div className="text-xs font-bold text-slate-400">
                  — {isAr ? activeTrack.highlightResult.studentAr : activeTrack.highlightResult.student}
                </div>
              </div>

              {/* Quick FAQ Accordion */}
              <div className="space-y-3">
                {activeTrack.faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                        isOpen
                          ? 'border-2 border-cyan-400/80 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 shadow-2xl shadow-cyan-950/60 ring-2 ring-cyan-500/30 my-3.5 scale-[1.01]'
                          : 'border border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className={`w-full p-4 sm:p-5 text-left rtl:text-right flex items-center justify-between gap-3 transition-colors ${
                          isOpen
                            ? 'text-cyan-300 font-extrabold text-sm sm:text-base bg-cyan-950/30'
                            : 'text-white font-bold text-xs sm:text-sm hover:bg-slate-800/60'
                        }`}
                      >
                        <span className="leading-snug">{isAr ? faq.qAr : faq.q}</span>
                        <span
                          className={`shrink-0 p-1.5 rounded-full transition-transform duration-200 ${
                            isOpen
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 rotate-180'
                              : 'text-slate-400 bg-slate-800/80'
                          }`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </span>
                      </button>
                      {isOpen && (
                        <div className="p-5 sm:p-6 text-sm sm:text-base text-slate-100 leading-relaxed border-t border-cyan-500/30 bg-slate-950/80">
                          <div className="border-l-4 rtl:border-l-0 rtl:border-r-4 border-cyan-400 pl-4 rtl:pl-0 rtl:pr-4 py-1 text-slate-200">
                            {isAr ? faq.aAr : faq.a}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Apply CTA */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => onOpenApply(activeTrack.id)}
                  className="w-full py-4 rounded-2xl text-sm sm:text-base font-bold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 shadow-xl shadow-brand-600/30 transition-all flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>{t(`Apply for ${activeTrack.title}`, `قدم على ${activeTrack.titleAr}`)}</span>
                  <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isAr ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                </button>
                <p className="text-[11px] text-center text-slate-500">
                  {t('Direct WhatsApp consultation after review.', 'محادثة مباشرة عبر واتساب بعد مراجعة طلبك.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
