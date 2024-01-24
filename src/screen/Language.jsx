import {
  Image,
  Text,
  Box,
  ScrollView,
  Container,
  VStack,
  HStack,
  Center,
  Select,
  View,
  Input,
} from 'native-base';
import {useEffect, useState} from 'react';
import ProfilePic from '../../assets/expense-management/Screenbuttons.icon/ActiveProfileScreen-Languagebutton.icon(1).png';
import TabNavigation from '../../componenets/CurrencyScreen/TabNavigation';
import Add from '../../assets/expense-management/Screenbuttons.icon/Record_ScreenPlussign.icon.png';
import withAuthenticationValidation from '../utils/withAuthenticationValidation';
import RNFS from 'react-native-fs';
//lang imports
import i18next, {languageResources} from '../services/i18next';

import {useLanguage} from '../utils/useLang';
import InterstitialAdComponent from '../../componenets/InterstitialAdComponent';

//lang import
const languageFiles = {
  en: require('../localLang/en.json'),
  zh: require('../localLang/zh.json'),
  // Add more languages as needed
};

// console.log('lang', i18next.language);
const Language = () => {
  //get default Lang
  // const Lang = i18next.language;

  //custom hook for launguage, arr{ t, changeLanguage, languagesList}
  const {t, changeLang, languagesList} = useLanguage();
  //change lang fucntion
  const changeLanguage = lang => {
    changeLang(lang);
    console.log('lang changed', lang);
  };
  const [jsonData, setJsonData] = useState({Key: 'Values'});

  useEffect(() => {
    const lang = i18next.language; // Get the language code from i18next
    const selectedLanguageFile = languageFiles[lang];

    if (selectedLanguageFile) {
      //clear for loading
      setJsonData(selectedLanguageFile);
    } else {
      console.error(`No JSON file found for language ${lang}`);
    }
  }, [i18next.language]);
  // console.log(jsonData);

  //handle values that are changed by input
  const [selectedItem, setSelectedItem] = useState('');
  // Function to handle input changes
  const handleInputChange = (value, key) => {
    console.log('handleInputChange fucntion');
    setSelectedItem(value);
  };

  const handleUpdate = async () => {
    if (selectedItem) {
      // Update the state
      setJsonData(prevData => ({...prevData, Key: selectedItem}));

      // Update the original JSON file using react-native-fs
      try {
        const lang = i18next.language;
        const filePath =
          RNFS.DocumentDirectoryPath + `../localLang/${lang}.json`;
        console.log('filePath', filePath);
        // Read the existing file content
        const existingContent = await RNFS.readFile(filePath);

        // Parse the JSON content
        const existingJson = JSON.parse(existingContent);

        // Update the JSON with the new value
        existingJson.Key = selectedItem;

        // Write the updated JSON back to the file
        await RNFS.writeFile(filePath, JSON.stringify(existingJson));

        Alert.alert('Item Updated', `New value: ${selectedItem}`);
      } catch (error) {
        console.error('Error updating JSON file:', error);
      }
    }
  };
  const {count, setCount} = useImageContext();
  return (
    <>
      {count > 2 ? <InterstitialAdComponent /> : null}

      <Box flex="1" safeAreaTop p="5" height="100vm">
        <ScrollView height="2000vm" showsVerticalScrollIndicator={false}>
          <VStack alignItems="center" h="100%" w="100%">
            <Container justifyContent="center" alignItems="center">
              <Image source={ProfilePic} size="200" alt="selected image" />
            </Container>
            <Box w="100%" flexDirection={'row'} alignItems={'center'}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                p={4}>
                {Object.keys(languagesList).map((languageCode, index) => (
                  <HStack
                    width="auto"
                    //   bg="orange.400"
                    key={languageCode}
                    px={3}
                    py={2}
                    borderRadius={5}
                    borderColor="orange.400"
                    alignItems="center">
                    <Text
                      onPress={() => changeLanguage(languageCode)}
                      fontSize={16}
                      fontWeight="bold"
                      mr={1}>
                      {languageCode}
                    </Text>
                  </HStack>
                ))}
              </ScrollView>
              <Image source={Add} size="6" mx="2" alt="add" />
            </Box>
            <VStack justifyContent={'flex-start'} w="100%">
              <Box pb="1">
                <Text fontSize={16} color="orange.400">
                  {t('bill-type')}
                </Text>
              </Box>
              <Box
                space={1}
                bg="white"
                borderWidth="3"
                borderColor="orange.400"
                width={'100%'}
                direction={'row'}
                alignItems={'flex-end'}>
                <Input
                  bg="white"
                  variant={'unstyled'}
                  textAlign="left"
                  width="auto"
                  placeholder={t('select-name-to-change')}
                  fontSize="xl"
                  value={selectedItem}
                  onSubmitEditing={handleUpdate}
                  onChangeText={name =>
                    setSelectedItem({...selectedItem, name})
                  }
                />
              </Box>

              {/* show all the name of titles and text present in the app */}
              <Box>
                {jsonData && typeof jsonData === 'object' ? (
                  Object.keys(jsonData).map(key => (
                    <View key={key}>
                      <Text
                        onPress={() => handleInputChange(jsonData[key], key)}>
                        {jsonData[key]}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text>No data available</Text>
                )}
              </Box>
            </VStack>
          </VStack>
        </ScrollView>
        <Box height="10%">
          <TabNavigation />
        </Box>
      </Box>
    </>
  );
};

export default withAuthenticationValidation(Language);
