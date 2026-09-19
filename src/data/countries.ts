export interface Country {
  code: string; // ISO 2-letter
  dial: string; // e.g. "+962"
  flag: string; // Emoji flag
  name: string;
  nameAr: string;
}

export const COUNTRIES: Country[] = [
  // Priority countries (Jordan, US, Gulf, Arab countries)
  { code: 'JO', dial: '+962', flag: '🇯🇴', name: 'Jordan', nameAr: 'الأردن' },
  { code: 'US', dial: '+1', flag: '🇺🇸', name: 'United States / Canada', nameAr: 'أمريكا / كندا' },
  { code: 'SA', dial: '+966', flag: '🇸🇦', name: 'Saudi Arabia', nameAr: 'السعودية' },
  { code: 'AE', dial: '+971', flag: '🇦🇪', name: 'UAE', nameAr: 'الإمارات' },
  { code: 'EG', dial: '+20', flag: '🇪🇬', name: 'Egypt', nameAr: 'مصر' },
  { code: 'PS', dial: '+970', flag: '🇵🇸', name: 'Palestine', nameAr: 'فلسطين' },
  { code: 'KW', dial: '+965', flag: '🇰🇼', name: 'Kuwait', nameAr: 'الكويت' },
  { code: 'QA', dial: '+974', flag: '🇶🇦', name: 'Qatar', nameAr: 'قطر' },
  { code: 'BH', dial: '+973', flag: '🇧🇭', name: 'Bahrain', nameAr: 'البحرين' },
  { code: 'OM', dial: '+968', flag: '🇴🇲', name: 'Oman', nameAr: 'عمان' },
  { code: 'IQ', dial: '+964', flag: '🇮🇶', name: 'Iraq', nameAr: 'العراق' },
  { code: 'LB', dial: '+961', flag: '🇱🇧', name: 'Lebanon', nameAr: 'لبنان' },
  { code: 'SY', dial: '+963', flag: '🇸🇾', name: 'Syria', nameAr: 'سوريا' },
  { code: 'YE', dial: '+967', flag: '🇾🇪', name: 'Yemen', nameAr: 'اليمن' },
  { code: 'SD', dial: '+249', flag: '🇸🇩', name: 'Sudan', nameAr: 'السودان' },
  { code: 'DZ', dial: '+213', flag: '🇩🇿', name: 'Algeria', nameAr: 'الجزائر' },
  { code: 'MA', dial: '+212', flag: '🇲🇦', name: 'Morocco', nameAr: 'المغرب' },
  { code: 'TN', dial: '+216', flag: '🇹🇳', name: 'Tunisia', nameAr: 'تونس' },
  { code: 'LY', dial: '+218', flag: '🇱🇾', name: 'Libya', nameAr: 'ليبيا' },

  // International & Europe
  { code: 'GB', dial: '+44', flag: '🇬🇧', name: 'United Kingdom', nameAr: 'بريطانيا' },
  { code: 'DE', dial: '+49', flag: '🇩🇪', name: 'Germany', nameAr: 'ألمانيا' },
  { code: 'IE', dial: '+353', flag: '🇮🇪', name: 'Ireland', nameAr: 'أيرلندا' },
  { code: 'AU', dial: '+61', flag: '🇦🇺', name: 'Australia', nameAr: 'أستراليا' },
  { code: 'TR', dial: '+90', flag: '🇹🇷', name: 'Turkey', nameAr: 'تركيا' },
  { code: 'FR', dial: '+33', flag: '🇫🇷', name: 'France', nameAr: 'فرنسا' },
  { code: 'IT', dial: '+39', flag: '🇮🇹', name: 'Italy', nameAr: 'إيطاليا' },
  { code: 'ES', dial: '+34', flag: '🇪🇸', name: 'Spain', nameAr: 'إسبانيا' },
  { code: 'SE', dial: '+46', flag: '🇸🇪', name: 'Sweden', nameAr: 'السويد' },
  { code: 'CH', dial: '+41', flag: '🇨🇭', name: 'Switzerland', nameAr: 'سويسرا' },
  { code: 'NL', dial: '+31', flag: '🇳🇱', name: 'Netherlands', nameAr: 'هولندا' },
  { code: 'BE', dial: '+32', flag: '🇧🇪', name: 'Belgium', nameAr: 'بلجيكا' },
  { code: 'AT', dial: '+43', flag: '🇦🇹', name: 'Austria', nameAr: 'النمسا' },
  { code: 'GR', dial: '+30', flag: '🇬🇷', name: 'Greece', nameAr: 'اليونان' },
  { code: 'RO', dial: '+40', flag: '🇷🇴', name: 'Romania', nameAr: 'رومانيا' },
  { code: 'HU', dial: '+36', flag: '🇭🇺', name: 'Hungary', nameAr: 'المجر' },
  { code: 'PL', dial: '+48', flag: '🇵🇱', name: 'Poland', nameAr: 'بولندا' },

  // Asia & Others
  { code: 'IN', dial: '+91', flag: '🇮🇳', name: 'India', nameAr: 'الهند' },
  { code: 'PK', dial: '+92', flag: '🇵🇰', name: 'Pakistan', nameAr: 'باكستان' },
  { code: 'MY', dial: '+60', flag: '🇲🇾', name: 'Malaysia', nameAr: 'ماليزيا' },
  { code: 'SG', dial: '+65', flag: '🇸🇬', name: 'Singapore', nameAr: 'سنغافورة' },
  { code: 'ID', dial: '+62', flag: '🇮🇩', name: 'Indonesia', nameAr: 'إندونيسيا' },
  { code: 'PH', dial: '+63', flag: '🇵🇭', name: 'Philippines', nameAr: 'الفلبين' },
  { code: 'NG', dial: '+234', flag: '🇳🇬', name: 'Nigeria', nameAr: 'نيجيريا' },
  { code: 'ZA', dial: '+27', flag: '🇿🇦', name: 'South Africa', nameAr: 'جنوب أفريقيا' },
  { code: 'BR', dial: '+55', flag: '🇧🇷', name: 'Brazil', nameAr: 'البرازيل' },
  { code: 'MX', dial: '+52', flag: '🇲🇽', name: 'Mexico', nameAr: 'المكسيك' },
];
