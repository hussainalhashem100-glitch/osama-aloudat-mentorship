'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { storage, ApplicationSubmission, Publication, SiteSettings } from '@/lib/storage';
import { Testimonial, Article, MENTORSHIP_TRACKS } from '@/data/content';
import Logo from '@/components/Logo';
import {
  Lock,
  Users,
  Award,
  BookOpen,
  BookMarked,
  Trash2,
  Plus,
  Phone,
  Mail,
  ExternalLink,
  Download,
  KeyRound,
  LogOut,
  Sliders,
  FileCheck,
  Send,
  Upload,
  X,
  Eye,
  EyeOff,
  ShieldAlert
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [activeTab, setActiveTab] = useState<'applications' | 'testimonials' | 'publications' | 'articles' | 'settings'>('applications');

  // Data states
  const [applications, setApplications] = useState<ApplicationSubmission[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(storage.getSettings());

  // Form states for adding items
  const [newTestimonial, setNewTestimonial] = useState({
    studentName: '',
    studentNameAr: '',
    track: 'USMLE Step 2 CK',
    trackAr: 'USMLE Step 2 CK',
    scoreOrResult: '',
    quote: '',
    quoteAr: '',
    date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    verified: true,
    avatarBg: 'from-blue-600 to-cyan-600',
    screenshotUrl: '',
  });

  const [newPublication, setNewPublication] = useState({
    title: '',
    titleAr: '',
    journal: '',
    year: new Date().getFullYear().toString(),
    link: '',
  });

  const [newArticle, setNewArticle] = useState({
    slug: '',
    title: '',
    titleAr: '',
    category: 'USMLE Strategy',
    categoryAr: 'استراتيجية USMLE',
    readTime: '4 min',
    readTimeAr: '٤ دقائق',
    date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    excerpt: '',
    excerptAr: '',
    content: '',
    contentAr: '',
  });

  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordChangedMsg, setPasswordChangedMsg] = useState(false);
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          setNewTestimonial((prev) => ({ ...prev, screenshotUrl: compressedDataUrl }));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Check auth session on mount (stays active for 30m when leaving admin)
  useEffect(() => {
    if (storage.isSessionValid()) {
      setIsAuthenticated(true);
      loadAllData();
    }
    const lockout = storage.getLockoutStatus();
    if (lockout.isLocked) {
      setLockoutSeconds(lockout.remainingSeconds);
    }
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  // Inactivity auto-lockout (30 minutes) & user activity tracking
  useEffect(() => {
    if (!isAuthenticated) return;

    // Check validity every 10 seconds (locks if inactive > 30 mins)
    const interval = setInterval(() => {
      if (!storage.isSessionValid()) {
        handleLogout();
      }
    }, 10000);

    const handleActivity = () => {
      storage.touchSession();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [isAuthenticated]);

  const loadAllData = () => {
    setApplications(storage.getApplications());
    setTestimonials(storage.getTestimonials());
    setPublications(storage.getPublications());
    setArticles(storage.getArticles());
    setSettings(storage.getSettings());
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const lockout = storage.getLockoutStatus();
    if (lockout.isLocked) {
      setLockoutSeconds(lockout.remainingSeconds);
      return;
    }

    const isValid = await storage.verifyPassword(passwordInput);
    if (isValid) {
      storage.clearFailedAttempts();
      storage.startSession();
      setIsAuthenticated(true);
      setPasswordError(false);
      setPasswordInput('');
      loadAllData();
    } else {
      const result = storage.recordFailedAttempt();
      setPasswordError(true);
      if (result.isLocked) {
        setLockoutSeconds(result.remainingSeconds);
      }
    }
  };

  const handleLogout = () => {
    storage.clearSession();
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  const handleStatusChange = (id: string, status: ApplicationSubmission['status']) => {
    storage.updateApplicationStatus(id, status);
    setApplications(storage.getApplications());
  };

  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    storage.addTestimonial(newTestimonial);
    setTestimonials(storage.getTestimonials());
    alert('Student result added successfully!');
    setNewTestimonial({
      studentName: '',
      studentNameAr: '',
      track: 'USMLE Step 2 CK',
      trackAr: 'USMLE Step 2 CK',
      scoreOrResult: '',
      quote: '',
      quoteAr: '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      verified: true,
      avatarBg: 'from-blue-600 to-cyan-600',
      screenshotUrl: '',
    });
  };

  const handleDeleteTestimonial = (id: string) => {
    if (confirm('Delete this testimonial?')) {
      storage.deleteTestimonial(id);
      setTestimonials(storage.getTestimonials());
    }
  };

  const handleAddPublication = (e: React.FormEvent) => {
    e.preventDefault();
    storage.addPublication(newPublication);
    setPublications(storage.getPublications());
    alert('Publication added successfully!');
    setNewPublication({
      title: '',
      titleAr: '',
      journal: '',
      year: new Date().getFullYear().toString(),
      link: '',
    });
  };

  const handleDeletePublication = (id: string) => {
    if (confirm('Delete this publication?')) {
      storage.deletePublication(id);
      setPublications(storage.getPublications());
    }
  };

  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    const autoSlug = newArticle.slug || newArticle.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    storage.addArticle({ ...newArticle, slug: autoSlug });
    setArticles(storage.getArticles());
    alert('Article published successfully!');
    setNewArticle({
      slug: '',
      title: '',
      titleAr: '',
      category: 'USMLE Strategy',
      categoryAr: 'استراتيجية USMLE',
      readTime: '4 min',
      readTimeAr: '٤ دقائق',
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      excerpt: '',
      excerptAr: '',
      content: '',
      contentAr: '',
    });
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm('Delete this article?')) {
      storage.deleteArticle(id);
      setArticles(storage.getArticles());
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storage.updateSettings(settings);
    setSettingsSavedMsg(true);
    setTimeout(() => setSettingsSavedMsg(false), 3000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim().length >= 6) {
      await storage.changePassword(newPassword.trim());
      setNewPassword('');
      setPasswordChangedMsg(true);
      setTimeout(() => setPasswordChangedMsg(false), 3000);
    } else {
      alert('Password must be at least 6 characters');
    }
  };

  const exportApplicationsToCSV = () => {
    const headers = ['ID', 'Date', 'Track', 'Name', 'WhatsApp', 'Email', 'Stage', 'Target Date', 'Status'];
    const rows = applications.map((a) => [
      a.id,
      a.submittedAt,
      `"${a.trackTitle}"`,
      `"${a.fullName}"`,
      `"${a.whatsapp}"`,
      `"${a.email}"`,
      `"${a.currentStage}"`,
      `"${a.targetExamDate}"`,
      a.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mentorship_applications_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to normalize phone number for WhatsApp link
  const normalizeWhatsApp = (raw: string) => {
    return raw.replace(/[^0-9]/g, '').replace(/^00/, '');
  };

  const handleDeleteApplication = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the application from ${name}?`)) {
      storage.deleteApplication(id);
      setApplications(storage.getApplications());
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
          <div className="mx-auto flex justify-center">
            <Logo size={56} />
          </div>

          <div>
            <h1 className="text-2xl font-black text-white">Mentor Portal</h1>
            <p className="text-xs text-slate-400 mt-1">
              Dr. Osama AlOudat Mentorship Management
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Password:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter Access Password"
                  autoFocus
                  disabled={lockoutSeconds > 0}
                  spellCheck={false}
                  autoComplete="current-password"
                  className="w-full pl-4 pr-11 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {passwordError && lockoutSeconds === 0 && (
                <p className="text-xs text-rose-400 font-semibold mt-2">
                  Incorrect Password. Please try again.
                </p>
              )}

              {lockoutSeconds > 0 && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2 mt-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>Too many failed attempts. Locked for {lockoutSeconds}s.</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={lockoutSeconds > 0}
              className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 shadow-md transition-all disabled:opacity-50"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              ← Return to Main Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <div>
              <span className="font-bold text-sm text-white">Dr. Osama AlOudat</span>
              <span className="text-[10px] text-cyan-400 block">Mentor Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          {[
            { id: 'applications', label: 'Applications', count: applications.length, icon: Users },
            { id: 'testimonials', label: 'Score Wall & Results', count: testimonials.length, icon: Award },
            { id: 'publications', label: 'Research & Publications', count: publications.length, icon: BookMarked },
            { id: 'articles', label: 'Articles (SEO)', count: articles.length, icon: BookOpen },
            { id: 'settings', label: 'Platform Settings & Telegram', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600 to-cyan-600 text-white shadow-md'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Mentorship Applications</h2>
                <p className="text-xs text-slate-400">
                  Real-time applications. Direct 1-click WhatsApp messaging normalized for international numbers.
                </p>
              </div>

              {applications.length > 0 && (
                <button
                  onClick={exportApplicationsToCSV}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors self-start"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              )}
            </div>

            {applications.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 text-slate-500 space-y-2">
                <Users className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-sm font-semibold">No applications received yet.</p>
                <p className="text-xs">When a student submits the form, they appear here and trigger a Telegram alert.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Student</th>
                      <th className="p-3.5">Program</th>
                      <th className="p-3.5">Stage & Target Date</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 space-y-1">
                          <div className="font-bold text-white text-sm">{app.fullName}</div>
                          <div className="flex items-center gap-3 text-slate-400">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-500" />
                              {app.email}
                            </span>
                            <span className="flex items-center gap-1 text-emerald-400 font-medium">
                              <Phone className="w-3 h-3" />
                              {app.whatsapp}
                            </span>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span className="px-2.5 py-1 rounded-full bg-brand-900/60 text-cyan-300 font-semibold border border-brand-800">
                            {app.trackTitle}
                          </span>
                        </td>

                        <td className="p-3.5 space-y-0.5">
                          <div className="text-slate-200">{app.currentStage}</div>
                          <div className="text-[11px] text-slate-500">Target: {app.targetExamDate}</div>
                        </td>

                        <td className="p-3.5">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value as any)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                              app.status === 'new'
                                ? 'bg-amber-950 text-amber-300 border-amber-800'
                                : app.status === 'contacted'
                                ? 'bg-blue-950 text-cyan-300 border-cyan-800'
                                : app.status === 'enrolled'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="enrolled">Enrolled</option>
                            <option value="archived">Archived</option>
                          </select>
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`https://wa.me/${normalizeWhatsApp(app.whatsapp)}?text=${encodeURIComponent(
                                `Hello Dr. ${app.fullName}, this is Dr. Osama AlOudat regarding your 1:1 mentorship application for ${app.trackTitle}.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDeleteApplication(app.id, app.fullName)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/80 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/40 transition-colors"
                              title="Delete application"
                              aria-label={`Delete application from ${app.fullName}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TESTIMONIALS & SCORE SCREENSHOTS */}
        {activeTab === 'testimonials' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Add Form */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Add Student Result & Score Report</span>
              </h3>

              <form onSubmit={handleAddTestimonial} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Student Name (EN):</label>
                  <input
                    type="text"
                    value={newTestimonial.studentName}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, studentName: e.target.value })}
                    placeholder="e.g. Dr. Omar H."
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Student Name (AR):</label>
                  <input
                    type="text"
                    value={newTestimonial.studentNameAr}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, studentNameAr: e.target.value })}
                    placeholder="مثال: د. عمر ح."
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-right"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Track:</label>
                    <select
                      value={newTestimonial.track}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, track: e.target.value, trackAr: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    >
                      <option value="USMLE Step 1">USMLE Step 1</option>
                      <option value="USMLE Step 2 CK">USMLE Step 2 CK</option>
                      <option value="IFOM Clinical">IFOM</option>
                      <option value="Medical CV & Match">Medical CV & Match</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Score / Badge:</label>
                    <input
                      type="text"
                      value={newTestimonial.scoreOrResult}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, scoreOrResult: e.target.value })}
                      placeholder="e.g. 264 or PASS"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1.5">
                    Verification / Feedback Screenshot (Score Report, DM Feedback, etc.):
                  </label>

                  {/* Upload Button + Hidden File Input */}
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleScreenshotUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-cyan-950/70 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 font-bold flex items-center gap-2 transition-colors text-xs"
                    >
                      <Upload className="w-4 h-4 text-cyan-400" />
                      <span>Upload Screenshot / Image</span>
                    </button>
                    <span className="text-[11px] text-slate-500">or paste URL below</span>
                  </div>

                  {/* Image Preview Thumbnail if attached */}
                  {newTestimonial.screenshotUrl && (
                    <div className="mb-2 p-2 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <img
                          src={newTestimonial.screenshotUrl}
                          alt="Screenshot Preview"
                          className="h-12 w-12 rounded-lg object-cover border border-slate-800 shrink-0"
                        />
                        <div className="text-[11px] text-slate-300 truncate">
                          <span className="text-cyan-400 font-semibold block">Screenshot Attached</span>
                          <span className="text-slate-500 truncate block max-w-xs">
                            {newTestimonial.screenshotUrl.startsWith('data:')
                              ? 'Uploaded from device'
                              : newTestimonial.screenshotUrl}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewTestimonial({ ...newTestimonial, screenshotUrl: '' })}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                        title="Remove Screenshot"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <input
                    type="text"
                    value={newTestimonial.screenshotUrl}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, screenshotUrl: e.target.value })}
                    placeholder="/screenshots/usmle-step2-264-sample.png or image URL"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Upload any proof image (Score Report, WhatsApp/Instagram DM feedback screenshot, etc.)
                  </p>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Testimonial Quote (EN):</label>
                  <textarea
                    value={newTestimonial.quote}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
                    rows={2}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Testimonial Quote (AR):</label>
                  <textarea
                    value={newTestimonial.quoteAr}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, quoteAr: e.target.value })}
                    rows={2}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-right"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 font-bold text-white transition-all"
                >
                  Publish Result Card
                </button>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-7 space-y-3">
              <h3 className="text-base font-bold text-white">Active Testimonials ({testimonials.length})</h3>
              <div className="space-y-2.5">
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{t.studentName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-semibold">
                          {t.track}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                          {t.scoreOrResult}
                        </span>
                        {t.screenshotUrl && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-bold border border-cyan-800 flex items-center gap-1">
                            <FileCheck className="w-3 h-3" />
                            <span>Report Attached</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 italic">"{t.quote}"</p>
                    </div>

                    <button
                      onClick={() => handleDeleteTestimonial(t.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors shrink-0"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RESEARCH & PUBLICATIONS */}
        {activeTab === 'publications' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Add Research Paper / Publication</span>
              </h3>

              <form onSubmit={handleAddPublication} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Paper Title (EN):</label>
                  <input
                    type="text"
                    value={newPublication.title}
                    onChange={(e) => setNewPublication({ ...newPublication, title: e.target.value })}
                    placeholder="e.g. Clinical Outcomes in Pediatric Gastroenterology..."
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Paper Title (AR - Optional):</label>
                  <input
                    type="text"
                    value={newPublication.titleAr}
                    onChange={(e) => setNewPublication({ ...newPublication, titleAr: e.target.value })}
                    placeholder="عنوان البحث بالعربية"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-right"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Journal / Conference:</label>
                    <input
                      type="text"
                      value={newPublication.journal}
                      onChange={(e) => setNewPublication({ ...newPublication, journal: e.target.value })}
                      placeholder="e.g. Journal of Pediatrics"
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Year:</label>
                    <input
                      type="text"
                      value={newPublication.year}
                      onChange={(e) => setNewPublication({ ...newPublication, year: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">PubMed / DOI Link (Optional):</label>
                  <input
                    type="url"
                    value={newPublication.link}
                    onChange={(e) => setNewPublication({ ...newPublication, link: e.target.value })}
                    placeholder="https://pubmed.ncbi.nlm.nih.gov/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold text-white transition-colors"
                >
                  Add Publication
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-3">
              <h3 className="text-base font-bold text-white">Publications List ({publications.length})</h3>
              {publications.length === 0 ? (
                <p className="text-xs text-slate-500 p-6 rounded-2xl bg-slate-900 border border-slate-800">
                  No publications added yet. When Dr. Osama adds research here, it will automatically show on the About section.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {publications.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-white text-sm">{p.title}</div>
                        <p className="text-xs text-slate-400">{p.journal} • {p.year}</p>
                      </div>
                      <button
                        onClick={() => handleDeletePublication(p.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: ARTICLES (SEO) */}
        {activeTab === 'articles' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Write & Publish New Article (SEO)</span>
              </h3>

              <form onSubmit={handleAddArticle} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Title (EN):</label>
                  <input
                    type="text"
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Title (AR):</label>
                  <input
                    type="text"
                    value={newArticle.titleAr}
                    onChange={(e) => setNewArticle({ ...newArticle, titleAr: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-right"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Category:</label>
                    <input
                      type="text"
                      value={newArticle.category}
                      onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Read Time:</label>
                    <input
                      type="text"
                      value={newArticle.readTime}
                      onChange={(e) => setNewArticle({ ...newArticle, readTime: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Excerpt (EN):</label>
                  <textarea
                    value={newArticle.excerpt}
                    onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                    rows={2}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Content (EN):</label>
                  <textarea
                    value={newArticle.content}
                    onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                    rows={4}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Content (AR):</label>
                  <textarea
                    value={newArticle.contentAr}
                    onChange={(e) => setNewArticle({ ...newArticle, contentAr: e.target.value })}
                    rows={4}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-right"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold text-white transition-colors"
                >
                  Publish Article
                </button>
              </form>
            </div>

            <div className="lg:col-span-6 space-y-3">
              <h3 className="text-base font-bold text-white">Published Articles ({articles.length})</h3>
              <div className="space-y-2.5">
                {articles.map((art) => (
                  <div
                    key={art.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-white text-sm">{art.title}</div>
                      <p className="text-xs text-slate-400 line-clamp-2">{art.excerpt}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteArticle(art.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PLATFORM SETTINGS & TELEGRAM */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Communication & Telegram Settings */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-400" />
                <span>Contact Channels & Telegram Alerts</span>
              </h3>

              <form onSubmit={handleSaveSettings} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Contact Email:</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Dr. Osama WhatsApp Number:</label>
                  <input
                    type="text"
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Instagram Profile URL:</label>
                  <input
                    type="url"
                    value={settings.instagram}
                    onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Telegram Bot Token:</label>
                    <input
                      type="text"
                      value={settings.telegramBotToken}
                      onChange={(e) => setSettings({ ...settings, telegramBotToken: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Telegram Chat ID (Destination):</label>
                    <input
                      type="text"
                      value={settings.telegramChatId}
                      onChange={(e) => setSettings({ ...settings, telegramChatId: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-[11px]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-white transition-colors"
                >
                  Save Platform Settings
                </button>

                {settingsSavedMsg && (
                  <p className="text-xs text-emerald-400 font-semibold text-center">
                    Settings saved successfully!
                  </p>
                )}
              </form>
            </div>

            {/* Security: Change Password */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 h-fit">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-cyan-400" />
                <span>Change Dashboard Password</span>
              </h3>

              <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    New Password (Min 6 chars, case-sensitive):
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      spellCheck={false}
                      autoComplete="new-password"
                      className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white transition-colors"
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-white transition-colors"
                >
                  Update Password
                </button>

                {passwordChangedMsg && (
                  <p className="text-xs text-emerald-400 font-semibold text-center">
                    Password updated successfully!
                  </p>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
