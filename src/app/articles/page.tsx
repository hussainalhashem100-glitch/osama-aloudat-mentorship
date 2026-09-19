'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import ArticleModal from '@/components/ArticleModal';
import { Article } from '@/data/content';
import { storage } from '@/lib/storage';
import { useLanguage } from '@/context/LanguageContext';
import { BookOpen, Clock, Calendar, ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';

export default function ArticlesListPage() {
  const { t, isAr } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  useEffect(() => {
    setArticles(storage.getArticles());
  }, []);

  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.titleAr.includes(searchTerm) ||
      art.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.excerptAr.includes(searchTerm);

    const matchesCategory =
      selectedCategory === 'all' ||
      art.category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onOpenApply={() => setIsApplyOpen(true)} />

      <main className="flex-grow py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t('Knowledge & Strategy Hub', 'مركز المقالات والأدلة')}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              {t('High-Yield Medical & USMLE Guides', 'أدلة ومقالات عالية الأهمية لـ USMLE')}
            </h1>
            <p className="text-base sm:text-lg text-slate-600">
              {t(
                'Actionable, evidence-based study roadmaps and clinical reasoning strategies for Step 1, Step 2 CK, IFOM, and the US Residency Match.',
                'استراتيجيات مدروسة وموجهة للتحضير لامتحانات Step 1 و Step 2 CK و IFOM والسيرة الذاتية الطبية.'
              )}
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 rtl:left-auto rtl:right-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('Search articles by topic or keyword...', 'ابحث عن موضوع أو مقال...')}
                className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-3 rounded-2xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
              />
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((art) => (
              <article
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="glass-card rounded-3xl p-7 shadow-sm hover:shadow-xl border border-slate-200/80 transition-all hover:-translate-y-1 flex flex-col justify-between group cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                      {isAr ? art.categoryAr : art.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{isAr ? art.readTimeAr : art.readTime}</span>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2">
                    {isAr ? art.titleAr : art.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {isAr ? art.excerptAr : art.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{art.date}</span>
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedArticle(art);
                    }}
                    className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                  >
                    <span>{t('Read Full Guide', 'اقرأ الدليل كاملاً')}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-sm">
              {t('No articles found matching your query.', 'لم يتم العثور على مقالات تطابق بحثك.')}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <ArticleModal
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onOpenApply={() => setIsApplyOpen(true)}
      />
      <ApplyModal isOpen={isApplyOpen} onClose={() => setIsApplyOpen(false)} />
    </div>
  );
}
