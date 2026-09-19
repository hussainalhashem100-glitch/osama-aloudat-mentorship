'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MentorshipSection from '@/components/MentorshipSection';
import ResultsWall from '@/components/ResultsWall';
import AboutSection from '@/components/AboutSection';
import ArticlesSection from '@/components/ArticlesSection';
import Footer from '@/components/Footer';
import ApplyModal from '@/components/ApplyModal';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

export default function HomePage() {
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [applyTrackId, setApplyTrackId] = useState<string | undefined>(undefined);

  const handleOpenApply = (trackId?: string) => {
    setApplyTrackId(trackId);
    setIsApplyOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 selection:bg-brand-500 selection:text-white relative">
      <Navbar onOpenApply={handleOpenApply} />
      <main className="flex-grow">
        <Hero onOpenApply={() => handleOpenApply()} />
        <MentorshipSection onOpenApply={handleOpenApply} />
        <ResultsWall onOpenApply={() => handleOpenApply()} />
        <AboutSection />
        <ArticlesSection onOpenApply={() => handleOpenApply()} />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <ApplyModal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        defaultTrackId={applyTrackId}
      />
    </div>
  );
}
