'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { MENTORSHIP_TRACKS } from '@/data/content';
import { storage } from '@/lib/storage';
import { X, Sparkles, CheckCircle2, ArrowRight, ArrowLeft, Phone, Mail, User, ChevronLeft, ChevronRight, ChevronDown, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import { COUNTRIES } from '@/data/countries';

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const BASE_YEARS = Array.from({ length: 15 }, (_, i) => 2025 + i); // 2025 through 2039

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTrackId?: string;
}

export default function ApplyModal({ isOpen, onClose, defaultTrackId }: ApplyModalProps) {
  const { t, isAr } = useLanguage();

  const [step, setStep] = useState<number>(1);
  const [trackId, setTrackId] = useState<string>(defaultTrackId || 'step1');
  const [fullName, setFullName] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+962');
  const [localPhone, setLocalPhone] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [currentStage, setCurrentStage] = useState<string>('');
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(11); // Default to Dec
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [targetExamDate, setTargetExamDate] = useState<string>('Dec 2026');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const mEn = MONTHS_EN[selectedMonthIdx];
    const mAr = MONTHS_AR[selectedMonthIdx];
    setTargetExamDate(isAr ? `${mAr} ${selectedYear}` : `${mEn} ${selectedYear}`);
  }, [selectedMonthIdx, selectedYear, isAr]);

  const handlePrevMonth = () => {
    setSelectedMonthIdx((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const handleNextMonth = () => {
    setSelectedMonthIdx((prev) => (prev === 11 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (defaultTrackId) {
      setTrackId(defaultTrackId);
    }
  }, [defaultTrackId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const cleanDigits = localPhone.replace(/^0+/, '').replace(/[^0-9]/g, '');
    setWhatsapp(cleanDigits ? `${countryCode} ${cleanDigits}` : '');
  }, [countryCode, localPhone]);

  const handlePhoneChange = (val: string) => {
    // If user pastes a number with '+'
    if (val.startsWith('+')) {
      const match = COUNTRIES.find((c) => val.startsWith(c.dial));
      if (match) {
        setCountryCode(match.dial);
        val = val.slice(match.dial.length);
      }
    } else if (val.startsWith('00')) {
      const without00 = '+' + val.slice(2);
      const match = COUNTRIES.find((c) => without00.startsWith(c.dial));
      if (match) {
        setCountryCode(match.dial);
        val = without00.slice(match.dial.length);
      }
    }
    // Strip leading 0
    val = val.replace(/^0+/, '');
    // Keep only digits and spacing/dashes
    val = val.replace(/[^0-9\s-]/g, '');
    setLocalPhone(val);
  };

  if (!isOpen) return null;

  const selectedTrack = MENTORSHIP_TRACKS.find((tr) => tr.id === trackId) || MENTORSHIP_TRACKS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanDigits = localPhone.replace(/[^0-9]/g, '');
    if (cleanDigits.length < 7) {
      alert(
        t(
          'Please enter a valid mobile number (at least 7 digits without leading zero).',
          'يرجى إدخال رقم هاتف صحيح (٧ أرقام على الأقل دون الصفر الأول).'
        )
      );
      return;
    }

    const finalWhatsApp = `${countryCode} ${cleanDigits}`;
    setIsSubmitting(true);

    try {
      storage.saveApplication({
        trackId: selectedTrack.id,
        trackTitle: isAr ? selectedTrack.titleAr : selectedTrack.title,
        fullName,
        email,
        whatsapp: finalWhatsApp,
        currentStage,
        targetExamDate,
        priorAttemptsOrScore: '',
        challenges: '',
      });

      setIsSubmitting(false);
      setIsSubmitted(true);

      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (err) {}
    } catch (err) {
      setIsSubmitting(false);
      alert(t('Something went wrong. Please try again.', 'حدث خطأ ما. يرجى المحاولة مرة أخرى.'));
    }
  };

  const handleReset = () => {
    setStep(1);
    setIsSubmitted(false);
    setFullName('');
    setLocalPhone('');
    setCountryCode('+962');
    setWhatsapp('');
    setEmail('');
    setCurrentStage('');
    setTargetExamDate('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={handleReset}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl z-10 text-white my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleReset}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 rtl:right-auto rtl:left-4 sm:rtl:left-5 z-30 p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header */}
            <div className="text-center space-y-1.5 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-500/20 text-cyan-300 text-xs font-bold border border-brand-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('1:1 Mentorship Application', 'طلب التقديم للإرشاد 1:1')}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {t('Apply for 1:1 Mentorship', 'تقديم طلب الإرشاد الفردي')}
              </h3>
            </div>

            {/* Stepper indicator */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className={`h-1.5 rounded-full transition-all ${
                    step === num
                      ? 'w-8 bg-cyan-400'
                      : step > num
                      ? 'w-5 bg-emerald-500'
                      : 'w-5 bg-slate-800'
                  }`}
                />
              ))}
            </div>

            {/* Step 1: Select Track */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    {t('1. Select Program:', '١. اختر البرنامج:')}
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {MENTORSHIP_TRACKS.map((track) => {
                    const isSelected = track.id === trackId;
                    return (
                      <div
                        key={track.id}
                        onClick={() => setTrackId(track.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between hover:scale-[1.01] active:scale-[0.99] ${
                          isSelected
                            ? 'bg-brand-600/20 border-cyan-400 text-white shadow-md ring-1 ring-cyan-400/40'
                            : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="text-sm font-bold">
                            {isAr ? track.titleAr : track.title}
                          </div>
                          <div className="text-[11px] text-cyan-400 font-semibold mt-0.5">
                            {isAr ? track.badgeAr : track.badge}
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-cyan-400 bg-cyan-400'
                              : 'border-slate-600'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>{t('Continue', 'متابعة')}</span>
                    <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Timeline & Stage */}
            {step === 2 && (
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t('2. Stage & Target Date:', '٢. مرحلتك وموعد الامتحان:')}
                </label>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('Current Stage:', 'المرحلة الحالية:')}
                  </label>
                  <select
                    value={currentStage}
                    onChange={(e) => setCurrentStage(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-700 text-sm bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value="">{t('Select your stage...', 'اختر مرحلتك...')}</option>
                    <option value="Medical Student (Basic)">{t('Medical Student (Basic Sciences)', 'طالب طب (سنوات أساسية)')}</option>
                    <option value="Medical Student (Clinical)">{t('Medical Student (Clinical Years)', 'طالب طب (سنوات سريرية)')}</option>
                    <option value="Intern / House Officer">{t('Intern / House Officer', 'طبيب امتياز')}</option>
                    <option value="Medical Graduate / Resident">{t('Medical Graduate / Resident', 'طبيب مقيم أو خريج')}</option>
                  </select>
                </div>

                {/* Target Exam Date: Year & Month Swapper */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-300">
                      {t('Target Exam Date:', 'موعد الامتحان المستهدف:')}
                    </label>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{targetExamDate}</span>
                    </div>
                  </div>

                  {/* Year selector & stepper */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="text-[11px] text-slate-400 font-medium">
                        {t('Select Year:', 'اختر السنة:')}
                      </div>
                      {/* Year stepper buttons for unlimited selection */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedYear((prev) => Math.max(2024, prev - 1))}
                          aria-label="Previous Year"
                          className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-bold text-cyan-400 min-w-[3.5rem] text-center font-mono">
                          {selectedYear}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedYear((prev) => prev + 1)}
                          aria-label="Next Year"
                          className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Swipeable year reel */}
                    <div className="relative">
                      <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-1 px-0.5 snap-x touch-pan-x -mx-1 px-1">
                        {Array.from(
                          new Set([...BASE_YEARS, selectedYear].sort((a, b) => a - b))
                        ).map((yr) => {
                          const isYrSelected = yr === selectedYear;
                          return (
                            <button
                              key={yr}
                              type="button"
                              onClick={() => setSelectedYear(yr)}
                              className={`snap-center flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                isYrSelected
                                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 ring-1 ring-cyan-300 scale-105'
                                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              {yr}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Month Swapper & Horizontal Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="text-[11px] text-slate-400 font-medium">
                        {t('Select Month (Tap or swipe):', 'اختر الشهر (اضغط أو مرر):')}
                      </div>
                      {/* Prev / Next buttons for simple swapping */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={handlePrevMonth}
                          aria-label="Previous Month"
                          className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-bold text-cyan-400 min-w-[3.5rem] text-center">
                          {isAr ? MONTHS_AR[selectedMonthIdx] : MONTHS_EN[selectedMonthIdx]}
                        </span>
                        <button
                          type="button"
                          onClick={handleNextMonth}
                          aria-label="Next Month"
                          className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* iPhone-style horizontal swipeable reel */}
                    <div className="relative">
                      <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-1 px-0.5 snap-x touch-pan-x -mx-1 px-1">
                        {(isAr ? MONTHS_AR : MONTHS_EN).map((mName, idx) => {
                          const isMSelected = idx === selectedMonthIdx;
                          return (
                            <button
                              key={mName}
                              type="button"
                              onClick={() => setSelectedMonthIdx(idx)}
                              className={`snap-center flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                                isMSelected
                                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 ring-2 ring-cyan-400 scale-105'
                                  : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/80'
                              }`}
                            >
                              {mName}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                    <span>{t('Back', 'رجوع')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!currentStage || !targetExamDate) {
                        alert(t('Please select stage and target date.', 'يرجى تحديد المرحلة والموعد.'));
                        return;
                      }
                      setStep(3);
                    }}
                    className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 transition-colors flex items-center gap-2"
                  >
                    <span>{t('Next: Contact Details', 'التالي: معلومات التواصل')}</span>
                    <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Contact Details (Flexible Phone Format) */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t('3. Contact Details:', '٣. معلومات التواصل:')}
                </label>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('Full Name:', 'الاسم الكريم:')}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3 rtl:left-auto rtl:right-3" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t('Dr. / Student Full Name', 'الاسم الكريم')}
                      required
                      className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 rounded-xl border border-slate-700 text-sm bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('WhatsApp Number (with Country Code):', 'رقم الواتساب (مع رمز الدولة):')}
                  </label>
                  <div className="flex gap-2">
                    {/* Country Code Dropdown */}
                    <div className="relative shrink-0 w-36 sm:w-44">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-full h-full py-2.5 px-2.5 rounded-xl border border-slate-700 text-xs sm:text-sm bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer appearance-none pr-7 rtl:pr-2.5 rtl:pl-7 font-medium"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={`${c.code}-${c.dial}`} value={c.dial} className="bg-slate-900 text-white">
                            {c.flag} {c.dial} ({isAr ? c.nameAr : c.name})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3.5 rtl:right-auto rtl:left-2.5 pointer-events-none" />
                    </div>

                    {/* Local Phone Number Input */}
                    <div className="relative flex-grow">
                      <Phone className="w-4 h-4 text-emerald-400 absolute left-3 top-3 rtl:left-auto rtl:right-3" />
                      <input
                        type="tel"
                        value={localPhone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="79 577 0421"
                        required
                        className="w-full pl-10 pr-3 rtl:pl-3 rtl:pr-10 py-2.5 rounded-xl border border-slate-700 text-sm bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Live International Preview & Hint */}
                  <div className="mt-1.5 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      {t('International Format:', 'الصيغة الدولية:')}
                    </span>
                    <span className="font-mono font-bold text-cyan-300 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                      {whatsapp || `${countryCode} ...`}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {t(
                      'Select your country code and enter mobile digits (no need to type leading 0).',
                      'اختر رمز دولتك ثم أدخل رقم هاتفك (لا داعي لكتابة الصفر الأول).'
                    )}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('Email Address:', 'البريد الإلكتروني:')}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 rtl:left-auto rtl:right-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                      className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 rounded-xl border border-slate-700 text-sm bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                    <span>{t('Back', 'رجوع')}</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-7 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-200" />
                    <span>{isSubmitting ? t('Submitting...', 'جارٍ الإرسال...') : t('Submit Application', 'إرسال الطلب')}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* Success Screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {t('Application Received!', 'تم استلام طلبك بنجاح!')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              {t(
                `Thank you ${fullName.trim().toLowerCase().startsWith('dr') ? fullName : `Dr. ${fullName}`}. Dr. Osama has been notified via Telegram and will reach out to you on WhatsApp at ${whatsapp}.`,
                `شكراً لك ${fullName.trim().startsWith('د') ? fullName : `د. ${fullName}`}. تم إشعار د. أسامة عبر تيليجرام وسيتواصل معك مباشرة عبر واتساب على الرقم ${whatsapp}.`
              )}
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              {t('Done', 'تم')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
