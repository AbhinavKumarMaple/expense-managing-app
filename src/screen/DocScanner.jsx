import React, {useEffect, useState} from 'react';
import {
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import DocumentScanner from 'react-native-document-scanner-plugin';
import RNFS from 'react-native-fs';
import {useNavigation} from '@react-navigation/native';
import ImageCropPicker from 'react-native-image-crop-picker';
import {useImageContext} from '../../componenets/ImageContext';
import {Box, Center, Image, Text, FlatList} from 'native-base';
import withAuthenticationValidation from '../utils/withAuthenticationValidation';
import TabNavigation from '../../componenets/HomeScreen/TabNavigation';

// Icons
import Camera from '../../assets/expense-management/Screenbuttons.icon/E&BLogoOrageTransparentBG.png';
import AddImage from '../../assets/expense-management/Screenbuttons.icon/Record_ScreenPlussign.icon.png';
import {useLanguage} from '../utils/useLang';
import InterstitialAdComponent from '../../componenets/InterstitialAdComponent';

const DocScanner = () => {
  //lang hook
  const {t, changeLanguage, languagesList} = useLanguage();

  const {newScannedImages, setNewScannedImages} = useImageContext();
  const navigation = useNavigation();

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission granted');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleScanDocument = async () => {
    try {
      const {scannedImages} = await DocumentScanner.scanDocument();
      console.log(scannedImages);
      setNewScannedImages([...newScannedImages, ...scannedImages]);
      navigation.navigate('RecordScreen');
    } catch (error) {
      console.log(error + 'HandleScanDocument');
    }
  };

  const handlePickImage = () => {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      multiple: true, // Enable multiple image selection
    })
      .then(responses => {
        const paths = responses.map(response => response.path);
        setNewScannedImages([...newScannedImages, ...paths]);
        navigation.navigate('RecordScreen');
      })
      .catch(error => {
        console.log('Image picking error:', error);
      });
  };
  const {count, setCount} = useImageContext();

  return (
    <>
      {count > 2 ? <InterstitialAdComponent /> : null}

      <Center justifyContent={'space-between'} itemAlign="center" h="100%">
        <Box
          justifyContent={'space-evenly'}
          h="80%"
          safeAreaTop="10"
          alignItems={'center'}>
          <TouchableOpacity onPress={handleScanDocument} itemAlign="center">
            <Image source={Camera} alt="select camera" size="xl" />
            <Text fontSize="xl" textAlign={'center'}>
              {t('scan-document')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePickImage} itemAlign="center">
            <Image source={AddImage} alt="select storage" size="xl" />
            <Text fontSize="xl" textAlign={'center'}>
              {t('add-image')}
            </Text>
          </TouchableOpacity>
        </Box>
        {/* {newScannedImages.length > 0 && (
        <Box w="100%" justifyContent="center" alignItems="center">
          <FlatList
            horizontal
            data={newScannedImages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <Image
                source={{uri: item}}
                alt="Selected Image"
                style={{
                  width: 50,
                  height: 50,
                  margin: 5,
                }}
              />
            )}
          />
        </Box>
      )} */}
        <TabNavigation />
      </Center>
    </>
  );
};

export default DocScanner;
