export interface MentorshipTrack {
  id: string;
  slug: string;
  title: string;
  titleAr: string;
  badge: string;
  badgeAr: string;
  tagline: string;
  taglineAr: string;
  description: string;
  descriptionAr: string;
  whoIsItFor: string[];
  whoIsItForAr: string[];
  whatYouGet: string[];
  whatYouGetAr: string[];
  process: { step: string; stepAr: string; title: string; titleAr: string; desc: string; descAr: string }[];
  faqs: { q: string; qAr: string; a: string; aAr: string }[];
  highlightResult: { score: string; student: string; studentAr: string; text: string; textAr: string };
}

export interface Testimonial {
  id: string;
  studentName: string;
  studentNameAr: string;
  track: string;
  trackAr: string;
  scoreOrResult: string;
  quote: string;
  quoteAr: string;
  date: string;
  verified: boolean;
  avatarBg: string;
  screenshotUrl?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  titleAr: string;
  excerpt: string;
  excerptAr: string;
  category: string;
  categoryAr: string;
  readTime: string;
  readTimeAr: string;
  date: string;
  content: string;
  contentAr: string;
}

export interface Resource {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  type: string;
  typeAr: string;
  format: string;
  downloadUrl: string;
}

export const MENTORSHIP_TRACKS: MentorshipTrack[] = [
  {
    id: 'step1',
    slug: 'usmle-step-1',
    title: 'USMLE Step 1',
    titleAr: 'USMLE Step 1',
    badge: 'Pass Guarantee Mindset',
    badgeAr: 'منهجية ضمان النجاح',
    tagline: 'Custom baseline diagnostic, weekly study blueprint, and strict accountability to pass on your first attempt.',
    taglineAr: 'تقييم تشخيصي دقيق، جدول أسبوعي منظم، ومتابعة صارمة لضمان النجاح من المحاولة الأولى.',
    description: 'We cut through resource overload. Focus 100% on high-yield retention and question analysis.',
    descriptionAr: 'ننهي تشتت المصادر بالكامل، ونركز على تثبيت المعلومات الأساسية وإتقان أسلوب حل الأسئلة.',
    whoIsItFor: [
      'Overwhelmed by multiple resources (FA, UWorld, Pathoma).',
      'Stuck on NBME practice scores without improvement.',
      'Needing strict daily structure and follow-up.'
    ],
    whoIsItForAr: [
      'الطلاب الذين يعانون من تشتت المصادر وتراكم المواد.',
      'من توقفت علاماتهم في امتحانات الـ NBME دون تقدم.',
      'كل من يحتاج لالتزام يومي ومتابعة دقيقة.'
    ],
    whatYouGet: [
      '1:1 Baseline Diagnostic Assessment',
      'Personalized Weekly Study Schedules',
      'High-Yield Resource Streamlining',
      'Direct WhatsApp Follow-up & Voice Check-ins',
      'NBME Score & Exam Readiness Prediction'
    ],
    whatYouGetAr: [
      'تقييم تشخيصي شامل لمستواك الحالي 1:1',
      'جدول دراسي أسبوعي مخصص لظروفك',
      'تحديد دقيق للمصادر المطلوبة بدون تشتت',
      'متابعة ومحادثات صوتية مباشرة عبر واتساب',
      'تحليل نتائج الـ NBME وتحديد موعد الامتحان'
    ],
    process: [
      { step: '01', stepAr: '١', title: 'Diagnostic', titleAr: 'التقييم', desc: 'Audit strengths and weak organ systems.', descAr: 'تحديد نقاط القوة والضعف بدقة.' },
      { step: '02', stepAr: '٢', title: 'Blueprint', titleAr: 'الخطة', desc: 'Daily study blocks & UWorld targets.', descAr: 'جدول دراسي يومي وأهداف محددة.' },
      { step: '03', stepAr: '٣', title: 'Check-ins', titleAr: 'المتابعة', desc: 'Weekly video calls & WhatsApp tracking.', descAr: 'متابعة أسبوعية وتواصل يومي.' },
      { step: '04', stepAr: '٤', title: 'Pass', titleAr: 'النجاح', desc: 'Targeted NBME score stabilization.', descAr: 'تثبيت الأداء واجتياز الامتحان.' }
    ],
    faqs: [
      {
        q: 'Is this a recorded course or live group?',
        qAr: 'هل هذه دورة مسجلة أو محاضرات جماعية؟',
        a: 'No. 100% individual 1:1 mentorship tailored solely to your schedule and weak areas.',
        aAr: 'لا، إرشاد فردي خاص 1:1 مصمم بالكامل وفق جدولك ونقاط ضعفك.'
      }
    ],
    highlightResult: {
      score: 'PASS',
      student: 'Dr. M. K. (IMG)',
      studentAr: 'د. مريم ك.',
      text: 'From failing NBMEs to passing Step 1 comfortably in 4 months under Dr. Osama.',
      textAr: 'من علامات رسوب في الـ NBME إلى اجتياز الامتحان بنجاح خلال 4 أشهر.'
    }
  },
  {
    id: 'step2ck',
    slug: 'usmle-step-2-ck',
    title: 'USMLE Step 2 CK',
    titleAr: 'USMLE Step 2 CK',
    badge: 'Target 250+ & 260+',
    badgeAr: 'هدف +250 و +260',
    tagline: 'Master clinical algorithms, test-taking stamina, and CMS forms to push your score into the top percentile.',
    taglineAr: 'إتقان خوارزميات التفكير السريري وسرعة الحل ونماذج CMS للوصول لأعلى المراتب.',
    description: 'Step 2 CK is the decisive numeric score for your US Residency Match. We train you to think like the test makers.',
    descriptionAr: 'علامة Step 2 CK هي المعيار الأهم في ملف قبولك للإقامة بأمريكا. ندربك على التفكير بعقلية واضعي الامتحان.',
    whoIsItFor: [
      'Targeting competitive US residency specialties requiring 250+.',
      'UWorld percentage plateaued at 60-70%.',
      'Need mastery of CMS forms and exam stamina.'
    ],
    whoIsItForAr: [
      'المتقدمون الراغبون في المنافسة على التخصصات الطبية بأمريكا.',
      'الطلاب الذين توقف معدل حلهم عند 60-70% في UWorld.',
      'من يحتاج لإتقان نماذج CMS وإدارة وقت الامتحان.'
    ],
    whatYouGet: [
      'Clinical Reasoning & Decision Tree Auditing',
      'High-Yield Systems Prioritization (IM, Peds, Surgery, OB/GYN)',
      'CMS & NBME Strategy Integration',
      'Weekly 1:1 Performance Reviews & WhatsApp Mentoring'
    ],
    whatYouGetAr: [
      'تدريب مكثف على التفكير الإكلينيكي وسرعة اتخاذ القرار',
      'تركيز عالي الأهمية على الباطنية والجراحة والأطفال والنسائية',
      'دمج استراتيجي لنماذج CMS وامتحانات NBME الحديثة',
      'مراجعات أسبوعية 1:1 ومتابعة مستمرة عبر واتساب'
    ],
    process: [
      { step: '01', stepAr: '١', title: 'Audit', titleAr: 'التشخيص', desc: 'Identify thought process pitfalls.', descAr: 'تشخيص أسباب اختيار الإجابات الخاطئة.' },
      { step: '02', stepAr: '٢', title: 'Algorithms', titleAr: 'الخوارزميات', desc: 'Master next-step-in-management logic.', descAr: 'إتقان الخطوة السريرية التالية في العلاج.' },
      { step: '03', stepAr: '٣', title: 'CMS Forms', titleAr: 'نماذج CMS', desc: 'Timed NBME drilling & stamina building.', descAr: 'تدريب مكثف على نماذج الـ CMS بالوقت.' },
      { step: '04', stepAr: '٤', title: '250+ Score', titleAr: 'الـ +250', desc: 'Test-day simulation and score peak.', descAr: 'تثبيت الأداء العالي قبل موعد الامتحان.' }
    ],
    faqs: [
      {
        q: 'Can I jump 20+ points with 1:1 mentorship?',
        qAr: 'هل يمكن زيادة درجتي بأكثر من 20 نقطة؟',
        a: 'Yes. Most mentees jump 20-35 points once clinical reasoning errors and speed issues are fixed.',
        aAr: 'نعم، معظم الطلاب يحققون قفزة بمعدل 20 إلى 35 نقطة بعد تصحيح أسلوب التفكير السريري.'
      }
    ],
    highlightResult: {
      score: '264',
      student: 'Dr. Tariq S.',
      studentAr: 'د. طارق س.',
      text: 'Jumped from 231 to 264. The clinical reasoning framework was the game-changer.',
      textAr: 'ارتفعت علامتي من 231 إلى 264. منهجية التفكير السريري كانت العامل الفاصل.'
    }
  },
  {
    id: 'ifom',
    slug: 'ifom',
    title: 'IFOM (BSE & CSE)',
    titleAr: 'امتحان IFOM',
    badge: 'Rank & Honors Focus',
    badgeAr: 'للمراتب الأولى والتخرج',
    tagline: 'High-yield NBME-standard prep tailored for university graduation requirements and regional residency matches.',
    taglineAr: 'تحضير دقيق بمعايير NBME لمتطلبات الجامعات وبرامج الإقامة التنافسية.',
    description: 'Master the 160-question IFOM format with USMLE-level question banks and targeted time management.',
    descriptionAr: 'إتقان نمط الـ 160 سؤالاً لامتحان IFOM بأساليب وحلول معتمدة وإدارة محكمة للوقت.',
    whoIsItFor: [
      'Students with university IFOM requirements in Jordan & the region.',
      'Applicants to competitive hospital residency programs.',
      'Balancing university rotations with exam preparation.'
    ],
    whoIsItForAr: [
      'طلاب الطب المطالبون بامتحان IFOM في كلياتهم.',
      'الأطباء المتقدمون لبرامج الإقامة التي تشترط درجات متميزة.',
      'من يحتاج للموازنة بين الدوام السريري ودراسة الامتحان.'
    ],
    whatYouGet: [
      'IFOM High-Yield Domain Mapping',
      'Time Management & Speed Drills',
      'Weekly Scheduled Blocks & WhatsApp Follow-up'
    ],
    whatYouGetAr: [
      'تحديد دقيق للمواضيع الأكثر تكراراً في امتحانات IFOM',
      'تدريب مكثف على سرعة الحل وإدارة الوقت',
      'جدول دراسي منظم ومتابعة مستمرة عبر واتساب'
    ],
    process: [
      { step: '01', stepAr: '١', title: 'Mapping', titleAr: 'المواءمة', desc: 'Align exam domains with high-yield topics.', descAr: 'مواءمة المواضيع الأكثر وزناً في الامتحان.' },
      { step: '02', stepAr: '٢', title: 'Drills', titleAr: 'التدريب', desc: 'Speed drilling on repetitive question patterns.', descAr: 'تدريب سريع على أنماط الأسئلة المتكررة.' },
      { step: '03', stepAr: '٣', title: 'Simulations', titleAr: 'المحاكاة', desc: 'Full-length practice exams under timed pressure.', descAr: 'امتحانات تجريبية كاملة تحت الضغط.' }
    ],
    faqs: [
      {
        q: 'Does IFOM prep build toward USMLE?',
        qAr: 'هل يفيد التحضير للـ IFOM في امتحانات USMLE؟',
        a: 'Yes, IFOM is written by the NBME and directly mirrors Step 1 and Step 2 CK concepts.',
        aAr: 'نعم، امتحان الـ IFOM صادر من NBME ويشابه تماماً أسئلة الـ USMLE.'
      }
    ],
    highlightResult: {
      score: 'Top 5%',
      student: 'Dr. Sarah A.',
      studentAr: 'د. سارة ع.',
      text: 'Scored in the 95th percentile and secured my #1 hospital match.',
      textAr: 'حققت علامة ضمن أعلى 5% وحصلت على مقعد الإقامة الأول.'
    }
  },
  {
    id: 'cv',
    slug: 'medical-cv',
    title: 'Medical CV & ERAS',
    titleAr: 'السيرة الذاتية الطبية و ERAS',
    badge: 'Match & Elective Oriented',
    badgeAr: 'للقبول والـ Match',
    tagline: 'Transform your medical CV from a generic list into a compelling, professional story for US electives and residency.',
    taglineAr: 'تحويل سيرتك الذاتية إلى قصة مهنية مقنعة بمعايير القبول الأمريكية للـ Electives والـ Match.',
    description: 'Program directors review applications in seconds. We write and format every line using US criteria and action verbs.',
    descriptionAr: 'مديرو البرامج يراجعون الملفات في ثوانٍ. نصيغ كل سطر بمعايير القبول الأمريكية وأفعال التأثير.',
    whoIsItFor: [
      'Applying for US clinical electives or research observerships.',
      'Preparing ERAS application for the upcoming Match cycle.',
      'Needing professional, ATS-compliant medical formatting.'
    ],
    whoIsItForAr: [
      'المتقدمون للتدريب السريري (Electives) أو الأبحاث بأمريكا.',
      'الأطباء المتقدمون للـ ERAS Match.',
      'من يحتاج لتنسيق طبي احترافي معتمد لدى لجان القبول.'
    ],
    whatYouGet: [
      'Line-by-Line Complete Rewrite & Restructuring',
      'Action-Oriented Bullet Points for Clinical & Research',
      'AAMC & US Residency Committee Formatting',
      'Personal Statement & Experience Coaching'
    ],
    whatYouGetAr: [
      'إعادة صياغة وهيكلة كاملة لسيرتك الذاتية سطر بسطر',
      'صياغة احترافية تركز على إنجازاتك الإكلينيكية والبحثية',
      'تنسيق معتمد ومطابق لمعايير AAMC وبرامج الإقامة',
      'توجيه مخصص للـ Personal Statement ووصف الخبرات'
    ],
    process: [
      { step: '01', stepAr: '١', title: 'Audit', titleAr: 'الحصر', desc: 'Extract all clinical, research, and leadership wins.', descAr: 'حصر كافة الإنجازات والأنشطة والخبرات.' },
      { step: '02', stepAr: '٢', title: 'Rewrite', titleAr: 'الصياغة', desc: 'Craft high-impact, quantified action descriptions.', descAr: 'صياغة أوصاف قوية بالأرقام والأفعال المؤثرة.' },
      { step: '03', stepAr: '٣', title: 'Format', titleAr: 'التنسيق', desc: 'ATS-friendly US medical export ready for submission.', descAr: 'تنسيق نهائي معتمد وجاهز للتقديم المباشر.' }
    ],
    faqs: [
      {
        q: 'Do you work on existing CVs or start fresh?',
        qAr: 'هل تعدلون سيرة موجودة أم تبدؤون من الصفر؟',
        a: 'Both. We review your existing draft or extract your experiences from scratch into US standard format.',
        aAr: 'الاثنان معاً، نراجع مسودتك الحالية أو نبني سيرة جديدة بالكامل بمعايير أمريكية.'
      }
    ],
    highlightResult: {
      score: 'MATCHED',
      student: 'Dr. Omar H.',
      studentAr: 'د. عمر ح.',
      text: 'Interviewers specifically complimented my CV structure. Matched PGY-1 at my top program!',
      textAr: 'أشاد مديرو البرامج بتنسيق واحترافية سيرتي الذاتية. تم قبولي في رغبتي الأولى!'
    }
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    studentName: 'Dr. Tariq S.',
    studentNameAr: 'د. طارق س.',
    track: 'USMLE Step 2 CK',
    trackAr: 'USMLE Step 2 CK',
    scoreOrResult: '264',
    quote: 'Stuck at 230 on practice tests. Dr. Osama fixed my clinical reasoning blind spots. Jumped to 264!',
    quoteAr: 'كنت متوقفاً عند 230. د. أسامة صحح لي طريقة تفكيري الإكلينيكي وقفزت علامتي إلى 264!',
    date: 'Aug 2026',
    verified: true,
    avatarBg: 'from-blue-500 to-cyan-500',
    screenshotUrl: '/screenshots/usmle-step2-264-sample.png'
  },
  {
    id: 't2',
    studentName: 'Dr. Maryam K.',
    studentNameAr: 'د. مريم ك.',
    track: 'USMLE Step 1',
    trackAr: 'USMLE Step 1',
    scoreOrResult: 'PASS',
    quote: 'Resource overload was paralyzing me. Dr. Osama gave me a clear weekly plan. Passed comfortably!',
    quoteAr: 'كثرة المصادر كانت تشتتني تماماً. وضع لي د. أسامة خطة أسبوعية واضحة ونجحت بكل راحة!',
    date: 'Jul 2026',
    verified: true,
    avatarBg: 'from-indigo-500 to-purple-500'
  },
  {
    id: 't3',
    studentName: 'Dr. Sarah A.',
    studentNameAr: 'د. سارة ع.',
    track: 'IFOM Clinical',
    trackAr: 'امتحان IFOM',
    scoreOrResult: 'Top 5%',
    quote: 'Scoring in the 95th percentile helped me secure my top residency match. His time strategy is gold.',
    quoteAr: 'حصولي على علامة ضمن أعلى 5% ساعدني في الفوز بمقعد الإقامة الأول. استراتيجية الوقت كانت ذهبية.',
    date: 'May 2026',
    verified: true,
    avatarBg: 'from-emerald-500 to-teal-500'
  },
  {
    id: 't4',
    studentName: 'Dr. Omar H.',
    studentNameAr: 'د. عمر ح.',
    track: 'Medical CV & Match',
    trackAr: 'السيرة الذاتية و ERAS',
    scoreOrResult: 'MATCHED',
    quote: 'Transformed my CV from a dry list into an impactful story. Matched at my #1 choice in the US.',
    quoteAr: 'حول سيرتي الذاتية من سرد جاف إلى قصة مؤثرة. تم قبولي في رغبتي الأولى بأمريكا.',
    date: 'Mar 2026',
    verified: true,
    avatarBg: 'from-amber-500 to-orange-500'
  },
  {
    id: 't5',
    studentName: 'Dr. Zaid N.',
    studentNameAr: 'د. زيد ن.',
    track: 'USMLE Step 2 CK',
    trackAr: 'USMLE Step 2 CK',
    scoreOrResult: '258',
    quote: 'Daily WhatsApp voice check-ins kept me accountable. Mastered the CMS forms and hit 258.',
    quoteAr: 'المتابعة اليومية على واتساب حفظت التزامي. أتقنت نماذج CMS وحققت 258.',
    date: 'Sep 2026',
    verified: true,
    avatarBg: 'from-blue-600 to-indigo-600'
  }
];

export const ARTICLES: Article[] = [
  {
    id: 'a1',
    slug: 'how-to-start-studying-for-usmle-step-1',
    title: 'How to Start Step 1: The Zero-Fluff Roadmap',
    titleAr: 'كيف تبدأ دراسة Step 1: خارطة الطريق العملية',
    excerpt: 'Avoid resource overload. The essential 4 resources and how to begin UWorld questions early.',
    excerptAr: 'تجنب فخ التشتت. أهم 4 مصادر معتمدة وكيف تبدأ بحل أسئلة UWorld مبكراً.',
    category: 'Step 1 Strategy',
    categoryAr: 'استراتيجية Step 1',
    readTime: '4 min',
    readTimeAr: '٤ دقائق',
    date: 'Sep 2026',
    content: `Starting USMLE Step 1 is often overwhelming due to endless resource options.

### 1. The Core 4 Resources
- **Question Bank**: UWorld (primary learning tool).
- **Core Text**: First Aid for Step 1.
- **Pathology**: Pathoma (Chapters 1-3 are mandatory).
- **Micro & Pharm**: Sketchy Medical.

### 2. Start Questions Early
Never wait until you finish reading to start UWorld. Questions are your textbook.

### 3. Active Recall over Passive Reading
Spaced repetition and explaining concepts aloud beat passive reading every time.`,
    contentAr: `بداية التحضير لـ Step 1 غالباً ما تكون مربكة بسبب كثرة المصادر.

### ١. المصادر الأربعة الأساسية
- **بنك الأسئلة**: UWorld (أداتك التعليمية الأولى).
- **المرجع الأساسي**: First Aid for Step 1.
- **علم الأمراض**: Pathoma (الفصول 1-3 أساسية).
- **الأحياء الدقيقة والأدوية**: Sketchy Medical.

### ٢. ابدأ بالأسئلة مبكراً
لا تنتظر حتى تنهي القراءة لتبدأ بـ UWorld. بنك الأسئلة هو كتابك الحقيقي.

### ٣. الاسترجاع النشط
التكرار المتباعد واختبار نفسك أفضل بمراحل من القراءة السلبية المتكررة.`
  },
  {
    id: 'a2',
    slug: 'step-2-ck-strategy-breaking-into-the-250s',
    title: 'Step 2 CK: How to Break into the 250s and 260s',
    titleAr: 'استراتيجية Step 2 CK: كيف تصل إلى +250 و +260',
    excerpt: 'Step 2 CK is your most vital residency metric. Master next-best-step algorithms and CMS forms.',
    excerptAr: 'العلامة الأهم لقبول الإقامة. أتقن خوارزميات الخطوة السريرية ونماذج CMS.',
    category: 'Step 2 CK Strategy',
    categoryAr: 'استراتيجية Step 2 CK',
    readTime: '5 min',
    readTimeAr: '٥ دقائق',
    date: 'Aug 2026',
    content: `Step 2 CK is the numeric differentiator on your ERAS application.

### 1. Think in Next Steps
Questions rarely ask "What is the diagnosis?" They ask:
- Best initial test vs. most accurate test?
- Immediate next step in unstable patients?

### 2. Master the CMS Forms
CMS forms from NBME reveal the exact testing style and clinical judgment expected.

### 3. Build 9-Hour Stamina
Simulate full 8-block test days to maintain sharp decision-making under mental fatigue.`,
    contentAr: `أصبح امتحان Step 2 CK المعيار الرقمي الحاسم لقبول الإقامة الأمريكية.

### ١. التفكير بالخطوة التالية
الأسئلة تركز على:
- الفحص المبدئي الأفضل مقابل الفحص الأكثر دقة.
- الإجراء الفوري التالي للحالات غير المستقرة.

### ٢. إتقان نماذج الـ CMS
نماذج CMS الصادرة من NBME توضح الأسلوب الفعلي المعتمد في الامتحان.

### ٣. بناء التحمل لـ 9 ساعات
تدرب على محاكاة أيام امتحان كاملة بـ 8 أقسام لضمان الحفاظ على تركيزك.`
  },
  {
    id: 'a3',
    slug: 'how-to-structure-a-us-standard-medical-cv',
    title: 'Structuring a US-Standard Medical CV for Electives & ERAS',
    titleAr: 'هيكلة السيرة الذاتية الطبية للـ Electives والـ ERAS',
    excerpt: 'How to use action verbs, quantify research, and format for US residency committees.',
    excerptAr: 'استخدام أفعال التأثير وتوثيق الأبحاث والتنسيق المعتمد لبرامج الإقامة الأمريكية.',
    category: 'Medical CV',
    categoryAr: 'السيرة الذاتية',
    readTime: '4 min',
    readTimeAr: '٤ دقائق',
    date: 'Aug 2026',
    content: `Program directors glance at CVs for only 30 seconds.

### 1. Reverse Chronological Order
Always place your most recent clinical and academic work at the top.

### 2. Action Verbs & Quantified Impact
Replace "responsible for patient rounds" with: "Evaluated 15+ daily inpatient pediatric admissions and presented management plans during multidisciplinary rounds."

### 3. Proper Citation Formatting
Format peer-reviewed publications and conference posters using standard AMA style.`,
    contentAr: `يراجع مديرو البرامج السير الذاتية في 30 ثانية فقط.

### ١. الترتيب الزمني العكسي
ضع أحدث الخبرات السريرية والأكاديمية في المقدمة دائماً.

### ٢. استخدام أفعال التأثير والأرقام
استبدل "كنت مسؤولاً عن المرضى" بصياغة دقيقة: "تقييم أكثر من 15 حالة أطفال منومة يومياً وتقديم خطط العلاج في الجولات السريرية".

### ٣. التوثيق الأكاديمي المعتمد
توثيق الأوراق البحثية والمؤتمرات وفقاً لمعايير AMA المعتمدة.`
  }
];

export const FREE_RESOURCES: Resource[] = [];

export const DOCTOR_PROFILE = {
  name: 'Osama AlOudat, MD',
  nameAr: 'د. أسامة عودات',
  title: 'Pediatric Resident Physician & Medical Educator',
  titleAr: 'طبيب مقيم في طب الأطفال بالولايات المتحدة وموجه أكاديمي',
  location: 'United States',
  locationAr: 'الولايات المتحدة الأمريكية',
  image: '/osama-profile.jpg',
  email: 'husbush999@gmail.com',
  whatsapp: '+1 (314) 685-9642',
  instagram: 'https://www.instagram.com/osamasami_odat?stkn=MmNtY2RkdjVvcXh2&utm_source=qr',
  instagramHandle: '@osamasami_odat',
  bio: `Dr. Osama AlOudat is a US pediatric resident physician, pediatric GI fellowship applicant, and top-10 graduate of Jordan University of Science and Technology (JUST). Having completed two years of pediatric residency at King Abdullah University Hospital (KAUH) in Jordan before successfully matching into the US, he founded this 1:1 mentorship to give students the direct diagnostic assessment, individualized study plan, and daily accountability needed to achieve top-tier scores.`,
  bioAr: `د. أسامة عودات طبيب مقيم في طب الأطفال بالولايات المتحدة الأمريكية ومتقدم لزمالة الجهاز الهضمي للأطفال، وخريج ضمن العشرة الأوائل بتكنو. بعد إتمام عامين من الإقامة بمستشفى الملك المؤسس بالأردن والمطابقة بنجاح في أمريكا، أطلق برنامج الإرشاد الفردي لتزويد الطلاب بالتقييم الدقيق والخطة الفردية والمتابعة اليومية لتحقيق أعلى الدرجات.`
};
