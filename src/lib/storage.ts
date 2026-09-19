import { Testimonial, Article, Resource, TESTIMONIALS, ARTICLES, FREE_RESOURCES } from '@/data/content';

export interface ApplicationSubmission {
  id: string;
  trackId: string;
  trackTitle: string;
  fullName: string;
  email: string;
  whatsapp: string;
  currentStage: string;
  targetExamDate: string;
  priorAttemptsOrScore: string;
  challenges: string;
  submittedAt: string;
  status: 'new' | 'contacted' | 'enrolled' | 'archived';
}

export interface Publication {
  id: string;
  title: string;
  titleAr?: string;
  journal: string;
  year: string;
  link?: string;
}

export interface SiteSettings {
  email: string;
  whatsapp: string;
  instagram: string;
  telegramBotToken: string;
  telegramChatId: string;
}

const APPS_KEY = 'osama_mentorship_applications';
const TESTIMONIALS_KEY = 'osama_mentorship_testimonials';
const ARTICLES_KEY = 'osama_mentorship_articles';
const PUBLICATIONS_KEY = 'osama_mentorship_publications';
const RESOURCES_KEY = 'osama_mentorship_resources';
const SETTINGS_KEY = 'osama_site_settings';
const ADMIN_PASSWORD_HASH_KEY = 'osama_admin_password_hash';
const ADMIN_AUTH_SESSION_KEY = 'osama_admin_auth_session';
const ADMIN_LOCKOUT_KEY = 'osama_admin_lockout';
const ADMIN_FAILED_ATTEMPTS_KEY = 'osama_admin_failed_attempts';
const PASSWORD_SALT = 'osama_aloudat_med_secure_salt_2026';
// SHA-256 of ('osama2026' + PASSWORD_SALT)
const DEFAULT_PASSWORD_HASH = 'ed970cbd0a2a7b55b2d87a2f71f4f94e09396f004e26e34e9c36b7826666d11d';
const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30 * 1000; // 30 seconds

export async function hashPassword(password: string): Promise<string> {
  if (typeof crypto === 'undefined' || !crypto.subtle) {
    return password;
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(password + PASSWORD_SALT);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

const DEFAULT_SETTINGS: SiteSettings = {
  email: 'husbush999@gmail.com',
  whatsapp: '+1 (314) 685-9642',
  instagram: 'https://www.instagram.com/osamasami_odat?stkn=MmNtY2RkdjVvcXh2&utm_source=qr',
  telegramBotToken: '8970222147:AAFLlnZcG_rLK7cNjc6zJNORzOvW7NXnSZ0',
  telegramChatId: '7047197428',
};

export const storage = {
  // Settings
  getSettings: (): SiteSettings => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  updateSettings: (newSettings: Partial<SiteSettings>): SiteSettings => {
    const current = storage.getSettings();
    const updated = { ...current, ...newSettings };
    if (typeof window !== 'undefined') {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    }
    return updated;
  },

  // Applications
  getApplications: (): ApplicationSubmission[] => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(APPS_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveApplication: (app: Omit<ApplicationSubmission, 'id' | 'submittedAt' | 'status'>): ApplicationSubmission => {
    const list = storage.getApplications();
    const newApp: ApplicationSubmission = {
      ...app,
      id: 'app_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      submittedAt: new Date().toISOString(),
      status: 'new',
    };
    list.unshift(newApp);
    if (typeof window !== 'undefined') {
      localStorage.setItem(APPS_KEY, JSON.stringify(list));
    }

    // Trigger Telegram notification
    storage.sendTelegramAlert(newApp);

    return newApp;
  },

  sendTelegramAlert: async (app: ApplicationSubmission) => {
    try {
      const settings = storage.getSettings();
      if (!settings.telegramBotToken || !settings.telegramChatId) return;

      const text = `🔔 <b>New 1:1 Mentorship Application!</b>\n\n` +
        `👤 <b>Name:</b> ${app.fullName}\n` +
        `📚 <b>Program:</b> ${app.trackTitle}\n` +
        `📱 <b>WhatsApp:</b> ${app.whatsapp}\n` +
        `✉️ <b>Email:</b> ${app.email}\n` +
        `🏥 <b>Stage:</b> ${app.currentStage}\n` +
        `🎯 <b>Target Date:</b> ${app.targetExamDate}\n` +
        `⏱️ <b>Submitted:</b> ${new Date().toLocaleString()}`;

      const url = `https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`;
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: settings.telegramChatId,
          text: text,
          parse_mode: 'HTML',
        }),
      });
    } catch (err) {
      console.error('Telegram notification error:', err);
    }
  },

  updateApplicationStatus: (id: string, status: ApplicationSubmission['status']) => {
    const list = storage.getApplications();
    const updated = list.map((a) => (a.id === id ? { ...a, status } : a));
    if (typeof window !== 'undefined') {
      localStorage.setItem(APPS_KEY, JSON.stringify(updated));
    }
  },

  deleteApplication: (id: string) => {
    const list = storage.getApplications();
    const updated = list.filter((a) => a.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(APPS_KEY, JSON.stringify(updated));
    }
    return updated;
  },

  // Testimonials (with screenshotUrl)
  getTestimonials: (): Testimonial[] => {
    if (typeof window === 'undefined') return TESTIMONIALS;
    const raw = localStorage.getItem(TESTIMONIALS_KEY);
    if (!raw) return TESTIMONIALS;
    try {
      return JSON.parse(raw);
    } catch {
      return TESTIMONIALS;
    }
  },

  addTestimonial: (item: Omit<Testimonial, 'id'>) => {
    const list = storage.getTestimonials();
    const newItem: Testimonial = {
      ...item,
      id: 't_' + Date.now(),
    };
    list.unshift(newItem);
    if (typeof window !== 'undefined') {
      localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(list));
    }
    return newItem;
  },

  deleteTestimonial: (id: string) => {
    const list = storage.getTestimonials().filter((t) => t.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(list));
    }
  },

  // Publications
  getPublications: (): Publication[] => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(PUBLICATIONS_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  addPublication: (item: Omit<Publication, 'id'>) => {
    const list = storage.getPublications();
    const newItem: Publication = {
      ...item,
      id: 'pub_' + Date.now(),
    };
    list.unshift(newItem);
    if (typeof window !== 'undefined') {
      localStorage.setItem(PUBLICATIONS_KEY, JSON.stringify(list));
    }
    return newItem;
  },

  deletePublication: (id: string) => {
    const list = storage.getPublications().filter((p) => p.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(PUBLICATIONS_KEY, JSON.stringify(list));
    }
  },

  // Articles
  getArticles: (): Article[] => {
    if (typeof window === 'undefined') return ARTICLES;
    const raw = localStorage.getItem(ARTICLES_KEY);
    if (!raw) return ARTICLES;
    try {
      return JSON.parse(raw);
    } catch {
      return ARTICLES;
    }
  },

  addArticle: (item: Omit<Article, 'id'>) => {
    const list = storage.getArticles();
    const newItem: Article = {
      ...item,
      id: 'a_' + Date.now(),
    };
    list.unshift(newItem);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ARTICLES_KEY, JSON.stringify(list));
    }
    return newItem;
  },

  deleteArticle: (id: string) => {
    const list = storage.getArticles().filter((a) => a.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ARTICLES_KEY, JSON.stringify(list));
    }
  },

  // Resources
  getResources: (): Resource[] => {
    if (typeof window === 'undefined') return FREE_RESOURCES;
    const raw = localStorage.getItem(RESOURCES_KEY);
    if (!raw) return FREE_RESOURCES;
    try {
      return JSON.parse(raw);
    } catch {
      return FREE_RESOURCES;
    }
  },

  addResource: (item: Omit<Resource, 'id'>) => {
    const list = storage.getResources();
    const newItem: Resource = {
      ...item,
      id: 'res_' + Date.now(),
    };
    list.unshift(newItem);
    if (typeof window !== 'undefined') {
      localStorage.setItem(RESOURCES_KEY, JSON.stringify(list));
    }
    return newItem;
  },

  deleteResource: (id: string) => {
    const list = storage.getResources().filter((r) => r.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(RESOURCES_KEY, JSON.stringify(list));
    }
  },

  // Admin Auth & Cybersecurity
  verifyPassword: async (password: string): Promise<boolean> => {
    if (typeof window === 'undefined') return false;
    const computed = await hashPassword(password);
    const savedHash = localStorage.getItem(ADMIN_PASSWORD_HASH_KEY) || DEFAULT_PASSWORD_HASH;
    return computed === savedHash;
  },

  changePassword: async (newPassword: string): Promise<void> => {
    if (typeof window === 'undefined') return;
    const newHash = await hashPassword(newPassword);
    localStorage.setItem(ADMIN_PASSWORD_HASH_KEY, newHash);
  },

  // 30-minute session management (stays open for 30m when leaving admin, locks if inactive)
  isSessionValid: (): boolean => {
    if (typeof window === 'undefined') return false;
    const raw = localStorage.getItem(ADMIN_AUTH_SESSION_KEY);
    if (!raw) return false;
    try {
      const { lastActive } = JSON.parse(raw);
      const now = Date.now();
      if (now - lastActive < SESSION_DURATION_MS) {
        return true;
      } else {
        // Expired
        localStorage.removeItem(ADMIN_AUTH_SESSION_KEY);
        return false;
      }
    } catch {
      return false;
    }
  },

  startSession: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ADMIN_AUTH_SESSION_KEY, JSON.stringify({ lastActive: Date.now() }));
    }
  },

  touchSession: () => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(ADMIN_AUTH_SESSION_KEY);
      if (raw) {
        localStorage.setItem(ADMIN_AUTH_SESSION_KEY, JSON.stringify({ lastActive: Date.now() }));
      }
    }
  },

  clearSession: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ADMIN_AUTH_SESSION_KEY);
      sessionStorage.removeItem('osama_admin_auth');
    }
  },

  // Brute-force rate limiting
  getLockoutStatus: (): { isLocked: boolean; remainingSeconds: number } => {
    if (typeof window === 'undefined') return { isLocked: false, remainingSeconds: 0 };
    const raw = localStorage.getItem(ADMIN_LOCKOUT_KEY);
    if (!raw) return { isLocked: false, remainingSeconds: 0 };
    try {
      const { lockedUntil } = JSON.parse(raw);
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (remaining > 0) {
        return { isLocked: true, remainingSeconds: remaining };
      }
      localStorage.removeItem(ADMIN_LOCKOUT_KEY);
      return { isLocked: false, remainingSeconds: 0 };
    } catch {
      return { isLocked: false, remainingSeconds: 0 };
    }
  },

  recordFailedAttempt: (): { isLocked: boolean; remainingSeconds: number } => {
    if (typeof window === 'undefined') return { isLocked: false, remainingSeconds: 0 };
    const current = parseInt(localStorage.getItem(ADMIN_FAILED_ATTEMPTS_KEY) || '0', 10) + 1;
    if (current >= MAX_FAILED_ATTEMPTS) {
      localStorage.removeItem(ADMIN_FAILED_ATTEMPTS_KEY);
      const lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
      localStorage.setItem(ADMIN_LOCKOUT_KEY, JSON.stringify({ lockedUntil }));
      return { isLocked: true, remainingSeconds: 30 };
    } else {
      localStorage.setItem(ADMIN_FAILED_ATTEMPTS_KEY, current.toString());
      return { isLocked: false, remainingSeconds: 0 };
    }
  },

  clearFailedAttempts: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ADMIN_FAILED_ATTEMPTS_KEY);
      localStorage.removeItem(ADMIN_LOCKOUT_KEY);
    }
  },
};
