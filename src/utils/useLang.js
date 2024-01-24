import AsyncStorage from '@react-native-async-storage/async-storage';
import i18next, {languageResources} from '../services/i18next';
import {useTranslation} from 'react-i18next';
import languagesList from '../services/languagesList.json';
import showCustomToast from '../../componenets/Toast';
import {useEffect, useState} from 'react';
import {useToast} from 'native-base';

const LANG_STORAGE_KEY = '@language';

export const useLanguage = () => {
  const toast = useToast();
  const {t} = useTranslation();
  const [initialized, setInitialized] = useState(false);

  const initLanguage = async () => {
    const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
    if (savedLanguage && languageResources.hasOwnProperty(savedLanguage)) {
      i18next.changeLanguage(savedLanguage);
    }
    setInitialized(true);
  };

  useEffect(() => {
    if (!initialized) {
      initLanguage();
    }
  }, [initialized]);

  const changeLang = async lng => {
    console.log('uselang hook', lng);
    if (languagesList.hasOwnProperty(lng)) {
      await AsyncStorage.setItem(LANG_STORAGE_KEY, lng);
      showCustomToast({title: `${languagesList[lng].name} applied`, toast});
      i18next.changeLanguage(lng);
    } else {
      console.log('language does not exist');
      showCustomToast((title = 'language does not exist'));
    }
  };

  return {t, languagesList, changeLang, languageResources, initialized};
};
