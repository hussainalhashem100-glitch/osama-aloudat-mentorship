'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Article } from '@/data/content';
import { storage } from '@/lib/storage';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';
import ArticleModal from '@/components/ArticleModal';

interface ArticlesSectionProps {
  onOpenApply: () => void;
}

export default function ArticlesSection({ onOpenApply }: ArticlesSectionProps) {
  const { t, isAr } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    setArticles(storage.getArticles());
  }, []);

  return (
    <section id="articles" className="py-20 lg:py-24 bg-slate-950 text-white relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-800">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-bold uppercase tracking-wider border border-cyan-500/20">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t('High-Yield Guides', 'مقالات عالية الأهمية')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              {t('USMLE & Medical Strategy Articles', 'أدلة واستراتيجيات USMLE')}
            </h2>
          </div>

          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>{t('View All Guides', 'عرض جميع الأدلة')}</span>
            <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((art) => (
            <article
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all hover:-translate-y-1 flex flex-col justify-between group shadow-xl cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                    {isAr ? art.categoryAr : art.category}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{isAr ? art.readTimeAr : art.readTime}</span>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  {isAr ? art.titleAr : art.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {isAr ? art.excerptAr : art.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">{art.date}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedArticle(art);
                  }}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>{t('Read', 'اقرأ')}</span>
                  <ArrowRight className={`w-3 h-3 ${isAr ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Article Reading Lightbox Modal */}
      <ArticleModal
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onOpenApply={onOpenApply}
      />
    </section>
  );
}
