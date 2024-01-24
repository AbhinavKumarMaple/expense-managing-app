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
} from 'native-base';
import {useEffect, useState} from 'react';
import ProfilePic from '../../assets/expense-management/Screenbuttons.icon/ActiveProfileScreen-Currency.icon.png';
import TabNavigation from '../../componenets/CurrencyScreen/TabNavigation';
import withAuthenticationValidation from '../utils/withAuthenticationValidation';
import {useLanguage} from '../utils/useLang';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InterstitialAdComponent from '../../componenets/InterstitialAdComponent';
import {useImageContext} from '../../componenets/ImageContext';

const CurrencyScreen = () => {
  const [selectedOptions, setSelectedOptions] = useState();

  const currencyOptions = [
    {label: 'USD', value: 'USD'},
    {label: 'EUR', value: 'EUR'},
    {label: 'JPY', value: 'JPY'},
  ];

  const decimalOptions = [0, 1, 2, 3, 4, 5];

  useEffect(() => {
    const loadSelectedOptions = async () => {
      try {
        const savedOptions = await AsyncStorage.getItem('selectedOptions');
        if (savedOptions) {
          setSelectedOptions(JSON.parse(savedOptions));
        }
      } catch (error) {
        console.error('Error loading selected options:', error);
      }
    };

    loadSelectedOptions();
  }, []);

  const handleCurrencyChange = itemValue => {
    const updatedOptions = {
      ...selectedOptions,
      currency: itemValue,
    };
    setSelectedOptions(updatedOptions);
    // Save updated options to AsyncStorage
    AsyncStorage.setItem('selectedOptions', JSON.stringify(updatedOptions));
  };

  const handleDecimalPointsChange = itemValue => {
    const updatedOptions = {
      ...selectedOptions,
      decimalPoints: itemValue,
    };
    setSelectedOptions(updatedOptions);
    // Save updated options to AsyncStorage
    AsyncStorage.setItem('selectedOptions', JSON.stringify(updatedOptions));
  };

  //lang hook
  const {t, changeLanguage, languagesList} = useLanguage();
  const {count, setCount} = useImageContext();

  return (
    <>
      {count > 2 ? <InterstitialAdComponent /> : null}
      <Box flex="1" safeAreaTop pt={50}>
        <ScrollView>
          <VStack
            justifyContent="space-between"
            alignItems="center"
            py={5}
            space={50}
            h="100%"
            w="100%">
            <Container justifyContent="center" alignItems="center">
              <Image source={ProfilePic} alt="Alternate Text" size="xl" />
            </Container>
            <Center flex={1} p={4}>
              <VStack space={4} alignItems="center" w="80%">
                <Text fontSize="xl">{t('currency')}</Text>
                <Select
                  _selectedItem={{
                    bg: 'gray.100', // Set the background color of the selected item
                    borderColor: 'orange.400',
                    color: 'orange.400',
                    borderWidth: '4',
                  }}
                  _item={{
                    bg: 'gray.100',
                    _focusVisible: {
                      bg: 'orange.400', // Set the background color of the pressed options
                    },
                  }}
                  selectedValue={selectedOptions?.currency}
                  minWidth={200}
                  placeholder="Select currency"
                  onValueChange={handleCurrencyChange}>
                  {currencyOptions.map(option => (
                    <Select.Item
                      _pressed={{bgColor: 'gray.100'}}
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </Select>
                <Text fontSize="xl">{t('decimal-point')}</Text>
                <Select
                  _item={{
                    bg: 'gray.100',
                  }}
                  selectedValue={selectedOptions?.decimalPoints}
                  minWidth={120}
                  onValueChange={handleDecimalPointsChange}>
                  {decimalOptions.map(option => (
                    <Select.Item
                      _pressed={{bgColor: 'gray.100'}}
                      key={option}
                      label={option.toString()}
                      value={option}
                    />
                  ))}
                </Select>
              </VStack>
            </Center>
          </VStack>
        </ScrollView>
        <TabNavigation />
      </Box>
    </>
  );
};

export default withAuthenticationValidation(CurrencyScreen);
