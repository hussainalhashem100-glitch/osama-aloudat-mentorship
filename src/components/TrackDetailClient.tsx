'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import { MENTORSHIP_TRACKS } from '@/data/content';
import { useLanguage } from '@/context/LanguageContext';
import { CheckCircle2, Award, ArrowRight, Sparkles, HelpCircle, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface TrackDetailClientProps {
  trackSlug: string;
}

export default function TrackDetailClient({ trackSlug }: TrackDetailClientProps) {
  const { t, isAr } = useLanguage();
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const track = MENTORSHIP_TRACKS.find((tr) => tr.slug === trackSlug) || MENTORSHIP_TRACKS[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onOpenApply={() => setIsApplyOpen(true)} />

      <main className="flex-grow py-12 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-brand-600 transition-colors">
              {t('Home', 'الرئيسية')}
            </Link>
            <span>/</span>
            <Link href="/#tracks" className="hover:text-brand-600 transition-colors">
              {t('Mentorship', 'برامج الإرشاد')}
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">{isAr ? track.titleAr : track.title}</span>
          </div>

          {/* Hero Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
              <Award className="w-4 h-4" />
              <span>{isAr ? track.badgeAr : track.badge}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              {isAr ? track.titleAr : track.title}
            </h1>
            <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-3xl">
              {isAr ? track.taglineAr : track.tagline}
            </p>
          </div>

          {/* Core Overview Card */}
          <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-xl border border-white space-y-8">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">
                {t('Program Overview', 'نبذة عن البرنامج')}
              </h2>
              <p className="text-slate-700 leading-relaxed">
                {isAr ? track.descriptionAr : track.description}
              </p>
            </div>

            {/* Who is it for */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {t('Who This Program Is Designed For:', 'لمن صمم هذا البرنامج:')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(isAr ? track.whoIsItForAr : track.whoIsItFor).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 font-medium leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What you get */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {t('What You Receive During 1:1 Mentorship:', 'ما ستحصل عليه خلال فترة الإرشاد:')}
              </h3>
              <div className="space-y-2.5">
                {(isAr ? track.whatYouGetAr : track.whatYouGet).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      ✓
                    </div>
                    <span className="text-sm text-slate-700 leading-normal">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4-Step Process */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {t('The 4-Step Mentorship Blueprint:', 'مراحل خطة العمل (٤ خطوات):')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {track.process.map((pr, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="text-sm font-black text-brand-600">
                      {isAr ? pr.stepAr : pr.step}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {isAr ? pr.titleAr : pr.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {isAr ? pr.descAr : pr.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlight Result Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-900 to-navy-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
              <div className="space-y-2 text-center sm:text-left rtl:sm:text-right">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  {t('Featured Result', 'نتيجة مميزة')}
                </span>
                <p className="text-sm text-slate-200 italic max-w-xl">
                  "{isAr ? track.highlightResult.textAr : track.highlightResult.text}"
                </p>
                <div className="text-xs font-bold text-cyan-200">
                  — {isAr ? track.highlightResult.studentAr : track.highlightResult.student}
                </div>
              </div>
              <div className="text-2xl font-black text-cyan-300 bg-white/10 px-5 py-2.5 rounded-2xl border border-white/10 shrink-0">
                {track.highlightResult.score}
              </div>
            </div>

            {/* FAQs */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-600" />
                <span>{t('Frequently Asked Questions', 'الأسئلة الشائعة حول البرنامج')}</span>
              </h3>
              <div className="space-y-3">
                {track.faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                        isOpen
                          ? 'border-2 border-brand-500 bg-white shadow-2xl shadow-brand-900/10 ring-2 ring-brand-500/20 my-3.5 scale-[1.01]'
                          : 'border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className={`w-full p-4 sm:p-5 text-left rtl:text-right flex items-center justify-between gap-3 transition-colors ${
                          isOpen
                            ? 'bg-brand-50/50 text-brand-950 font-extrabold text-sm sm:text-base'
                            : 'text-slate-900 font-bold text-sm hover:bg-slate-50'
                        }`}
                      >
                        <span className="leading-snug">
                          {isAr ? faq.qAr : faq.q}
                        </span>
                        <span
                          className={`shrink-0 p-1.5 rounded-full transition-transform duration-200 ${
                            isOpen
                              ? 'bg-brand-500/15 text-brand-700 border border-brand-500/30 rotate-180'
                              : 'text-slate-400 bg-slate-100'
                          }`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </span>
                      </button>
                      {isOpen && (
                        <div className="p-5 sm:p-6 text-sm sm:text-base text-slate-800 leading-relaxed border-t border-brand-100 bg-brand-50/20">
                          <div className="border-l-4 rtl:border-l-0 rtl:border-r-4 border-brand-500 pl-4 rtl:pl-0 rtl:pr-4 py-1 text-slate-700">
                            {isAr ? faq.aAr : faq.a}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Apply CTA Button */}
            <div className="pt-6 text-center space-y-3">
              <button
                onClick={() => setIsApplyOpen(true)}
                className="w-full sm:w-auto px-10 py-4 rounded-full text-base font-bold text-white bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 shadow-xl shadow-brand-500/25 transition-all inline-flex items-center justify-center gap-2 group"
              >
                <Sparkles className="w-5 h-5 text-cyan-200" />
                <span>{t(`Apply for ${track.title}`, `قدم على ${track.titleAr}`)}</span>
                <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isAr ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
              </button>
              <p className="text-xs text-slate-500">
                {t('Direct WhatsApp consultation after review.', 'محادثة مباشرة عبر واتساب بعد مراجعة طلبك.')}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ApplyModal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        defaultTrackId={track.id}
      />
    </div>
  );
}
