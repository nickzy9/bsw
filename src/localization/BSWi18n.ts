import i18n from 'i18next';
import 'intl-pluralrules';

import {initReactI18next} from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        'Oops! Something went wrong': 'Oops! Something went wrong',
        'Invalid Data received.': 'Invalid Data received.',
        'Albums are empty': 'Albums are empty',
        'Try Agian!': 'Try Again!',
      },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
