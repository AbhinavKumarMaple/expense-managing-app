import React, {useState} from 'react';
import {Modal, View, Text, Image} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {useRoute} from '@react-navigation/native';
import {useImageContext} from './ImageContext';
import {useNavigation} from '@react-navigation/native';

const ImageDetailScreen = () => {
  const route = useRoute();
  const {newScannedImages, setNewScannedImages} = useImageContext();
  const {imageUri, isLocal, currentIndex} = route.params;

  // State for handling modal
  const [modalVisible, setModalVisible] = useState(true);

  const localImages = newScannedImages.map(path => ({
    url: `file://${path}`,
  }));

  const cloudImages = imageUri.map(path => ({
    url: path,
  }));

  //navigation Hook
  const navigation = useNavigation();

  //navigation for going back
  const goBack = () => {
    navigation.goBack();
    console.log('go back');
  };

  return (
    <Modal visible={modalVisible} transparent={true}>
      {isLocal ? (
        <ImageViewer
          imageUrls={localImages}
          index={currentIndex}
          onSwipeDown={() => {
            setModalVisible(false);
            goBack();
          }}
          enableSwipeDown={true}
          renderHeader={() => (
            <View style={{padding: 10, backgroundColor: 'black'}}>
              <Text style={{color: 'white'}}>Image Viewer Header</Text>
            </View>
          )}
          renderFooter={() => (
            <View style={{padding: 10, backgroundColor: 'white'}}>
              <Text style={{color: 'black'}}>Ads or Footer Content</Text>
            </View>
          )}
        />
      ) : (
        <ImageViewer
          imageUrls={cloudImages}
          index={currentIndex}
          onSwipeDown={() => {
            setModalVisible(false);
            goBack();
          }}
          enableSwipeDown={true}
          renderHeader={() => (
            <View style={{padding: 10, backgroundColor: 'black'}}>
              <Text style={{color: 'white'}}>Image Viewer Header</Text>
            </View>
          )}
          renderFooter={() => (
            <View style={{padding: 10, backgroundColor: 'white'}}>
              <Text style={{color: 'black'}}>Ads or Footer Content</Text>
            </View>
          )}
        />
      )}
    </Modal>
  );
};

export default ImageDetailScreen;
