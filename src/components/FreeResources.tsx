'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Resource } from '@/data/content';
import { storage } from '@/lib/storage';
import { Download, FileText, CheckCircle, ArrowDownToLine } from 'lucide-react';

interface FreeResourcesProps {
  onOpenApply: () => void;
}

export default function FreeResources({ onOpenApply }: FreeResourcesProps) {
  const { t, isAr } = useLanguage();
  const [resources, setResources] = useState<Resource[]>([]);
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  useEffect(() => {
    setResources(storage.getResources());
  }, []);

  const handleDownload = (id: string) => {
    setDownloadedId(id);
    setTimeout(() => setDownloadedId(null), 3000);
  };

  return (
    <section id="resources" className="py-20 lg:py-24 bg-slate-900 text-white relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-bold uppercase tracking-wider border border-cyan-500/20">
            <Download className="w-3.5 h-3.5" />
            <span>{t('Free Downloads', 'تحميلات مجانية')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            {t('High-Yield Templates & Checklists', 'نماذج وقوائم تدقيق عالية الأهمية')}
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            {t('General study roadmaps and CV templates created by Dr. Osama.', 'نماذج عامة وخطة عمل أعدها د. أسامة.')}
          </p>
        </div>

        {/* Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {resources.map((res) => {
            const isDownloaded = downloadedId === res.id;
            return (
              <div
                key={res.id}
                className="p-5 rounded-3xl bg-slate-950 border border-slate-800 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-9 h-9 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center font-bold">
                      <FileText className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {res.format}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">
                    {isAr ? res.titleAr : res.title}
                  </h3>

                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {isAr ? res.descriptionAr : res.description}
                  </p>
                </div>

                <button
                  onClick={() => handleDownload(res.id)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isDownloaded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-cyan-600 text-white'
                  }`}
                >
                  {isDownloaded ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{t('Downloaded!', 'تم التحميل!')}</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownToLine className="w-3.5 h-3.5" />
                      <span>{t('Download Free', 'تحميل مجاني')}</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
