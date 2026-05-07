import type { UIDictionary } from './zh';
import { en } from './en';

export const ar = {
  ...en,
  meta: {
    siteTitle: 'شاعرية الفضاء | سلسلة توريد مواد البناء العالمية',
    siteDescription: 'موقع سينمائي داكن يقدّم التوريد العالمي للمواد، والفئات الرئيسية، وسيناريوهات التطبيق، والقدرات الأساسية، واستشارات المشاريع.',
  },
  brand: {
    name: 'شاعرية الفضاء',
  },
  navigation: {
    hero: 'المقدمة',
    vision: 'الشبكة',
    stone: 'الحجر',
    wood: 'الخشب',
    scenarios: 'السيناريوهات',
    features: 'المزايا',
    craftsmanship: 'الحرفة',
    contact: 'التواصل',
  },
  actions: {
    contact: 'استفسار المشروع',
    openMenu: 'فتح التنقل',
    closeMenu: 'إغلاق التنقل',
    chooseLanguage: 'اختيار اللغة',
  },
  languagePicker: {
    title: 'لغات الموقع العالمية',
    description: 'بدّل لغة التصفح بما يلائم عملاء B2B حول العالم.',
    current: 'اللغة الحالية',
    cookieNotice: 'سيتم حفظ تفضيل اللغة في المتصفح.',
  },
} as const satisfies UIDictionary;
