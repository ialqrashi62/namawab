import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import arBase from '../../docs/i18n/ar.base.json';
import enBase from '../../docs/i18n/en.base.json';
import arCardio from '../../docs/i18n/cardiology.ar.json';
import enCardio from '../../docs/i18n/cardiology.en.json';
import arEd from '../../docs/i18n/ed.ar.json';
import enEd from '../../docs/i18n/ed.en.json';

const ar = { ...arBase, ...arCardio, ...arEd };
const en = { ...enBase, ...enCardio, ...enEd };

void i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ar',
    supportedLngs: ['ar', 'en'],
    resources: { ar: { translation: ar }, en: { translation: en } },
    interpolation: { escapeValue: false },
    detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] },
  });

i18next.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
});

export const i18n = i18next;
