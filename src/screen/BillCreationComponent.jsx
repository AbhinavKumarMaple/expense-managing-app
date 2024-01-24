import React, {useState, useEffect} from 'react';
import {Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';
import {
  Select,
  Pressable,
  Box,
  Text,
  ScrollView,
  useToast,
  FlatList,
} from 'native-base';
import {iconsList} from '../utils/IconsList';
import {useNavigation} from '@react-navigation/native'; // Import the hook
import withAuthenticationValidation from '../utils/withAuthenticationValidation';
//firebase
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';
import showCustomToast from '../../componenets/Toast';
import TabNavigation from '../../componenets/Profile/TabNavigation';
import {useLanguage} from '../utils/useLang';
import InterstitialAdComponent from '../../componenets/InterstitialAdComponent';

const BillCreationComponent = () => {
  const navigation = useNavigation();
  const DefaultIcon = require('../../assets/expense-management/Screenbuttons.icon/Record_Screen-BillType.icon.png');
  const Add = require('../../assets/expense-management/Screenbuttons.icon/Record_ScreenPlussign.icon.png');
  //Toast
  const toast = useToast();

  const [selectedIcon, setSelectedIcon] = useState(null);
  const [selectedBillType, setSelectedBillType] = useState('');
  const [existingBills, setExistingBills] = useState([]);
  //Icon Index
  const [index, setIndex] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(60);

  const route = useRoute();
  const defaultIconUrl = route.params?.defaultIcon || null;
  const defaultBillType = route.params?.defaultBillType || '';
  //Loading image
  const [loading, setLoading] = useState(false);
  //fetch userId
  const user = firebase.auth().currentUser;

  useEffect(() => {
    if (defaultIconUrl) {
      setSelectedIcon({uri: defaultIconUrl});
    }
    if (defaultBillType) {
      setSelectedBillType(defaultBillType);
    }

    //Image Lzy Loading
    // if (currentIndex < iconsList.length - 1 && currentIndex < 60) {
    //   const timer = setTimeout(() => {
    //     setCurrentIndex(currentIndex + 1);
    //   }, 1); // Adjust the delay to your preference

    //   return () => clearTimeout(timer);
    // }
  }, [defaultIconUrl, defaultBillType, currentIndex]);

  const handleIconChange = index => {
    const selectedIcon = iconsList[index].Icon;
    console.log('icon: ', selectedIcon, 'index: ', index);
    setIndex(index);
    setSelectedIcon(selectedIcon);
  };

  const handleSubmit = async () => {
    if (!selectedBillType) {
      showCustomToast({
        title: 'Please select Bill Type',
        status: 'error',
        toast,
        id: 'test-toast',
      });
      return;
    }
    if (!selectedIcon) {
      showCustomToast({
        title: 'Please select an Icon',
        status: 'error',
        toast,
        id: 'test-toast',
      });
      return;
    }
    try {
      const categoryData = {
        categoryName: selectedBillType,
        iconName: index.toString(),
        userId: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      const newCategoryRef = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('categories')
        .add(categoryData);

      const newCategoryId = newCategoryRef.id;

      navigation.setParams({
        CategoryName: selectedBillType,
        CategoryId: newCategoryId,
        CategoryIcon: selectedIcon,
      });

      console.log('Category created successfully');
      setSelectedBillType('');
      setSelectedIcon('');
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('HomeScreen'); // Replace 'HomeScreen' with the actual name of your HomeScreen
      }
    } catch (error) {
      console.error('Error creating category:', error);
      showCustomToast({
        title: 'An error occurred',
        status: 'error',
        toast,
        id: 'test-toast',
      });
      setSelectedBillType('');
      setSelectedIcon('');
      navigation.navigate('HomeScreen');
    }
  };

  //language hook
  const {t, changeLanguage, languagesList} = useLanguage();
  const {count, setCount} = useImageContext();

  return (
    <>
      {count > 2 ? <InterstitialAdComponent /> : null}
      <Box flex={1} p={2} safeAreaTop="5">
        {/* Big icon at the top */}
        <Box alignItems="center" mb={2}>
          <Image
            source={selectedIcon || DefaultIcon}
            style={{width: 160, height: 160}}
            alt={'Selected Icon'}
          />
          <Pressable
            onPress={() => handleSubmit()}
            justifyContent={'flex-start'}
            alignItems={'flex-end'}
            w="100%"
            px="8"
            m="8">
            <Image
              source={Add}
              style={{width: 40, height: 40}}
              alt={'Selected Icon'}
            />
          </Pressable>
        </Box>

        {/* Select bill type */}
        <Pressable
          onPress={() => navigation.navigate('BillType', {selectedBillType})}
          bg="gray.100"
          _pressed={{bg: 'gray.200'}}
          _text={{fontSize: 30}}
          py={3}
          mb={2}>
          <Text>{selectedBillType || t('select-bill-type')}</Text>
        </Pressable>

        {/* Change icon */}
        <Text fontSize="xl">{t('bill-type')}</Text>
        <Box flex={1} alignItems={'center'}>
          <FlatList
            data={iconsList.slice(0, currentIndex + 1)}
            keyExtractor={(item, index) => index.toString()}
            numColumns={9} // Adjust the number of columns as needed
            renderItem={({item, index}) => (
              <Pressable
                onPress={() => handleIconChange(index)}
                bgColor={'gray.200'}
                m="1"
                flexDirection="row">
                <Image
                  source={item.Icon}
                  style={{width: 40, height: 40}}
                  alt={`options ${index}`}
                />
              </Pressable>
            )}
          />
        </Box>
        <TabNavigation />
      </Box>
    </>
  );
};

export default withAuthenticationValidation(BillCreationComponent);
