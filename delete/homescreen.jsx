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
import {Center, Image, Text} from 'native-base';
import Camera from '../../assets/expense-management/Screenbuttons.icon/E&BLogoOrageTransparentBG.png';
import AddImage from '../../assets/expense-management/Screenbuttons.icon/Record_ScreenPlussign.icon.png';

const DocScanner = () => {
  const {newScannedImages, setNewScannedImages} = useImageContext();
  // const [oldScannedImages, setOldScannedImages] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    requestCameraPermission();
    // handleScanDocument();
    // loadSavedImages();
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
    })
      .then(response => {
        if (!response.didCancel) {
          setNewScannedImages([...newScannedImages, response.path]);
        }
      })
      .catch(error => {
        console.log('Image picking error:', error);
      });
  };

  // const renderNewScannedImages = () => {
  //   if (newScannedImages.length === 0) {
  //     return <Text>No newly scanned images yet.</Text>;
  //   }

  //   return (
  //     <ScrollView contentContainerStyle={styles.imageContainer}>
  //       {newScannedImages.map((uri, index) => (
  //         <Image key={index} source={{uri}} style={styles.scannedImage} />
  //       ))}
  //     </ScrollView>
  //   );
  // };

  // const renderOldScannedImages = () => {
  //   if (oldScannedImages.length === 0) {
  //     return <Text>No previously scanned images.</Text>;
  //   }

  //   return (
  //     <ScrollView contentContainerStyle={styles.imageContainer}>
  //       {oldScannedImages.map((uri, index) => (
  //         <Image key={index} source={{uri}} style={styles.scannedImage} />
  //       ))}
  //     </ScrollView>
  //   );
  // };

  // const deleteScannedImages = async () => {
  //   try {
  //     const pictureFolderPath = RNFS.PicturesDirectoryPath;
  //     const files = await RNFS.readDir(pictureFolderPath);
  //     const imageFiles = files.filter(
  //       file => file.isFile() && file.name.startsWith('DOCUMENT_SCAN_'),
  //     );

  //     for (let i = 0; i < imageFiles.length; i++) {
  //       const file = imageFiles[i];
  //       await RNFS.unlink(file.path);
  //     }

  //     setOldScannedImages([]);
  //     console.log('All scanned images deleted successfully.');
  //   } catch (error) {
  //     console.log('Error deleting scanned images:', error);
  //   }
  // };

  // const loadSavedImages = async () => {
  //   try {
  //     const pictureFolderPath = `${RNFS.ExternalDirectoryPath}/Pictures`;
  //     const files = await RNFS.readDir(pictureFolderPath);
  //     const imagePaths = files
  //       .filter(
  //         file => file.isFile() && /\.(jpg|jpeg|png|gif)$/i.test(file.name),
  //       )
  //       .map(file => `file://${file.path}`); // Add file:// prefix here
  //     console.log('Loaded image paths:', imagePaths);
  //     setOldScannedImages(imagePaths);
  //   } catch (error) {
  //     console.log('Error loading saved images:', error);
  //   }
  // };

  return (
    <Center justifyContent={'space-evenly'} itemAlign="center" h="100%">
      <TouchableOpacity onPress={handleScanDocument} itemAlign="center">
        <Image source={Camera} alt="Alternate Text" size="xl" />
        <Text fontSize="xl" textAlign={'center'}>
          Camera
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePickImage} itemAlign="center">
        <Image source={AddImage} alt="Alternate Text" size="xl" />
        <Text fontSize="xl" textAlign={'center'}>
          Add Image
        </Text>
      </TouchableOpacity>

      {/* <Text>Newly Scanned Images:</Text> */}
      {/* {renderNewScannedImages()} */}
      {/* <Text>Previously Saved Images:</Text> */}
      {/* {renderOldScannedImages()} */}
      {/* <TouchableOpacity
        style={styles.deleteButton}
        onPress={deleteScannedImages}>
        <Text style={styles.deleteButtonText}>Delete All Images</Text>
      </TouchableOpacity> */}
    </Center>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#007AFF',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 5,
  },
  scannedImage: {
    width: 120,
    height: 160,
    margin: 5,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DocScanner;
