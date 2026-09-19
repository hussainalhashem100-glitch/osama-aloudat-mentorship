'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import { Article } from '@/data/content';
import { storage } from '@/lib/storage';
import { useLanguage } from '@/context/LanguageContext';
import { Clock, Calendar, ArrowLeft, Sparkles, User } from 'lucide-react';
import Link from 'next/link';

interface ArticleDetailClientProps {
  slug: string;
}

// Clean markdown to HTML converter for articles
function renderMarkdown(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc pl-5 rtl:pl-0 rtl:pr-5 space-y-1.5 my-3 text-slate-300">
          {listItems.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const formatInline = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-cyan-300">$1</em>');
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={index} className="text-xl font-bold text-white mt-6 mb-2 tracking-tight">
          {trimmed.replace('### ', '')}
        </h3>
      );
    } else if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={index} className="text-2xl font-black text-cyan-300 mt-8 mb-3 tracking-tight">
          {trimmed.replace('## ', '')}
        </h2>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      listItems.push(trimmed.slice(2));
    } else if (trimmed.length > 0) {
      flushList();
      elements.push(
        <p
          key={index}
          className="text-slate-300 text-sm sm:text-base leading-relaxed my-3"
          dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
        />
      );
    }
  });

  flushList();
  return elements;
}

export default function ArticleDetailClient({ slug }: ArticleDetailClientProps) {
  const { t, isAr } = useLanguage();
  const [article, setArticle] = useState<Article | null>(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  useEffect(() => {
    const list = storage.getArticles();
    const found = list.find((a) => a.slug === slug) || list[0];
    setArticle(found);
  }, [slug]);

  if (!article) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <Navbar onOpenApply={() => setIsApplyOpen(true)} />

      <main className="flex-grow py-12 lg:py-20">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumbs & Back */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <Link
              href="/articles"
              className="inline-flex items-center gap-1.5 font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <ArrowLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
              <span>{t('Back to All Articles', 'العودة لجميع المقالات')}</span>
            </Link>

            <span className="font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
              {isAr ? article.categoryAr : article.category}
            </span>
          </div>

          {/* Article Header */}
          <div className="space-y-3 text-center sm:text-left rtl:sm:text-right border-b border-slate-800 pb-6">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {isAr ? article.titleAr : article.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-200">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Dr. Osama AlOudat, MD</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{isAr ? article.readTimeAr : article.readTime}</span>
              </div>
            </div>
          </div>

          {/* Rendered Body Content (No raw markdown syntax) */}
          <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            {renderMarkdown(isAr ? article.contentAr : article.content)}

            {/* In-Article Mentorship Conversion Callout */}
            <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-brand-900 via-slate-900 to-slate-950 border border-brand-500/30 text-white space-y-3 shadow-lg text-center sm:text-left rtl:sm:text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('Individualized Mentorship', 'إرشاد فردي خاص')}</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {t('Need a Custom Study Plan?', 'هل تحتاج إلى خطة دراسية مخصصة؟')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
                {t(
                  '1:1 mentorship gives you a diagnostic baseline audit, custom weekly schedule, and direct WhatsApp voice accountability with Dr. Osama.',
                  'الإرشاد الفردي 1:1 يمنحك تقييماً دقيقاً لمستواك، خطة أسبوعية مخصصة، ومتابعة صوتية يومية مباشرة عبر واتساب.'
                )}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setIsApplyOpen(true)}
                  className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md transition-all"
                >
                  {t('Apply for 1:1 Mentorship', 'قدم على الإرشاد الفردي')}
                </button>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
      <ApplyModal isOpen={isApplyOpen} onClose={() => setIsApplyOpen(false)} />
    </div>
  );
}
