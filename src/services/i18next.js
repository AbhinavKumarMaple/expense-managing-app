import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from '../localLang/en.json';
import zh from '../localLang/zh.json';
// import zh_CN from '../localLang/zh_CN.json';
// import fr from '../localLang/fr.json';
// import de from '../localLang/de.json';
// import es from '../localLang/es.json';
// import ja from '../localLang/ja.json';
// import ko from '../localLang/ko.json';

export const languageResources = {
  en: {translation: en},
  zh: {translation: zh},
  // zh_CN: {translation: zh_CN},
  // fr: {translation: fr},
  // de: {translation: de},
  // es: {translation: es},
  // ja: {translation: ja},
  // ko: {translation: ko},
};

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en',
  fallbackLng: 'en',
  resources: languageResources,
});

export default i18next;
