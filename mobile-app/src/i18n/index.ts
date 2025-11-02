import { createI18n } from 'vue-i18n';
import en from '../locales/en.json';
import fa from '../locales/fa.json';
import ar from '../locales/ar.json';
import fr from '../locales/fr.json';

const messages = {
  en,
  fa,
  ar,
  fr
};

// Get saved language preference or default to English
const savedLocale = localStorage.getItem('preferred-language') || 'en';

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages
});

export default i18n;

