'use client';

import React, { useEffect } from 'react';
import { Article } from '@/data/content';
import { useLanguage } from '@/context/LanguageContext';
import { X, Clock, Calendar, User, Sparkles, BookOpen } from 'lucide-react';

interface ArticleModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenApply?: () => void;
}

// Clean markdown to HTML converter for articles
function renderMarkdown(text: string) {
  if (!text) return null;
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
      .replace(/\*(.*?)\*/g, '<em class="text-cyan-300 font-medium">$1</em>');
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={index} className="text-lg sm:text-xl font-bold text-white mt-6 mb-2 tracking-tight">
          {trimmed.replace('### ', '')}
        </h3>
      );
    } else if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={index} className="text-xl sm:text-2xl font-black text-cyan-300 mt-8 mb-3 tracking-tight">
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

export default function ArticleModal({
  article,
  isOpen,
  onClose,
  onOpenApply,
}: ArticleModalProps) {
  const { t, isAr } = useLanguage();

  // Handle ESC key to dismiss
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity cursor-pointer"
        aria-label="Close backdrop"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-10 text-white flex flex-col my-auto overflow-hidden">
        {/* Sticky Header with Close Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isAr ? article.categoryAr : article.category}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Article Body */}
        <div className="overflow-y-auto px-6 sm:px-10 py-6 sm:py-8 space-y-6">
          {/* Article Title & Meta */}
          <div className="space-y-3 pb-6 border-b border-slate-800">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              {isAr ? article.titleAr : article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
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

          {/* Rendered Markdown Content */}
          <div className="space-y-4">
            {renderMarkdown(isAr ? (article.contentAr || article.content) : (article.content || article.contentAr))}
          </div>

          {/* In-Article Mentorship Callout */}
          {onOpenApply && (
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-brand-900/60 via-slate-900 to-slate-950 border border-cyan-500/30 text-white space-y-3 shadow-lg">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('Individualized Mentorship', 'إرشاد فردي خاص')}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
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
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenApply();
                  }}
                  className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md transition-all cursor-pointer"
                >
                  {t('Apply for 1:1 Mentorship', 'قدم على الإرشاد الفردي')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
