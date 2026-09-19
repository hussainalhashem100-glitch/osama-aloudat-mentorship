'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { X } from 'lucide-react';
import { storage } from '@/lib/storage';

const WhatsAppIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.301-.15-1.782-.879-2.057-.98-.276-.1-.477-.15-.678.15s-.779.98-.954 1.181c-.176.2-.351.226-.653.075-.301-.151-1.274-.469-2.427-1.498-.897-.8-1.503-1.789-1.68-2.09-.176-.302-.019-.465.132-.615.136-.135.301-.351.452-.527.15-.176.2-.301.301-.502.1-.2.05-.376-.025-.526-.075-.151-.678-1.634-.929-2.237-.245-.588-.493-.508-.678-.518l-.578-.01c-.2 0-.527.075-.803.376s-1.054 1.03-1.054 2.511 1.079 2.912 1.23 3.113c.15.2 2.124 3.243 5.145 4.549.718.311 1.279.497 1.716.636.722.23 1.379.197 1.899.12.579-.087 1.782-.728 2.033-1.431.251-.703.251-1.306.176-1.431-.075-.125-.276-.2-.577-.35zM12.042 2C6.52 2 2.03 6.49 2.03 12.012c0 1.98.583 3.824 1.59 5.378L2 22l4.77-1.564a9.96 9.96 0 0 0 5.272 1.496h.004c5.52 0 10.01-4.49 10.01-10.012A9.97 9.97 0 0 0 12.042 2z" />
  </svg>
);

export default function FloatingWhatsApp() {
  const { t, isAr } = useLanguage();
  const [showTooltip, setShowTooltip] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const settings = storage.getSettings();
  const rawPhone = settings.whatsapp || '+1 (314) 685-9642';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '').replace(/^00/, '');

  const greeting = encodeURIComponent(
    t(
      'Hello Dr. Osama, I have an inquiry regarding your 1:1 mentorship program.',
      'مرحباً د. أسامة، لدي استفسار بخصوص برنامج الإرشاد الفردي 1:1.'
    )
  );

  const waUrl = `https://wa.me/${cleanPhone}?text=${greeting}`;

  // Only show when user scrolls down to the 'High-Yield Guides' section (#articles) or near bottom
  useEffect(() => {
    const handleScroll = () => {
      const articlesEl = document.getElementById('articles');
      if (articlesEl) {
        const rect = articlesEl.getBoundingClientRect();
        // Reveal when the top of #articles enters the viewport
        if (rect.top <= window.innerHeight * 0.8) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } else {
        // Fallback for pages without #articles: show near the bottom
        const scrollPosition = window.scrollY + window.innerHeight;
        const totalHeight = document.documentElement.scrollHeight;
        if (scrollPosition >= totalHeight - 600) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-5 sm:bottom-6 z-40 flex items-center gap-2 sm:gap-3 transition-all duration-500 ease-out ${
        isAr ? 'left-4 sm:left-6 flex-row-reverse' : 'right-4 sm:right-6 flex-row'
      } ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-8 pointer-events-none'
      }`}
    >
      {/* Green Tooltip Popup with WhatsApp Logo */}
      {showTooltip && (
        <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] sm:text-xs px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-xl shadow-emerald-950/50 border border-emerald-400/30 flex items-center gap-2 sm:gap-2.5 animate-in fade-in slide-in-from-bottom-2 max-w-[calc(100vw-5.5rem)] whitespace-nowrap">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 sm:gap-2 font-bold hover:underline"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white shrink-0" />
            <span>{t('Chat with Dr. Osama on WhatsApp', 'تحدث مع د. أسامة عبر واتساب')}</span>
          </a>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-emerald-100 hover:text-white p-0.5 rounded-full hover:bg-emerald-700/50 transition-colors ml-1"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all duration-300 group border-2 border-white/30"
        aria-label="WhatsApp Contact"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-cyan-400 rounded-full border-2 border-slate-950 animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-cyan-400 rounded-full border-2 border-slate-950" />
        <WhatsAppIcon className="w-7 h-7 fill-white" />
      </a>
    </div>
  );
}
