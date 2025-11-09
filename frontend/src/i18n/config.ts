import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationHU from './locales/hu.json';
import translationEN from './locales/en.json';
import translationPL from './locales/pl.json';
import translationDE from './locales/de.json';

const resources = {
  hu: {
    translation: translationHU,
  },
  en: {
    translation: translationEN,
  },
  pl: {
    translation: translationPL,
  },
  de: {
    translation: translationDE,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'hu',
    lng: 'hu',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
