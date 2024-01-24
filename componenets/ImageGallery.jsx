import React from 'react';
import {
  View,
  ScrollView,
  Image,
  IconButton,
  Button,
  CloseIcon,
  Text,
} from 'native-base';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useImageContext} from '../componenets/ImageContext';
import FastImage from 'react-native-fast-image';

const ImageGallery = ({RecordScannedImages}) => {
  const {newScannedImages, setNewScannedImages} = useImageContext();
  const navigation = useNavigation();

  const handleImagePress = (uri, currentIndex, isLocal) => {
    // Navigate to a new screen to show the image in full size
    navigation.navigate('ImageDetailScreen', {
      imageUri: uri,
      isLocal,
      currentIndex,
    });
  };

  const removeImage = index => {
    const updatedImages = [...newScannedImages];
    updatedImages.splice(index, 1);
    setNewScannedImages(updatedImages);
  };

  const onAddImage = () => {
    navigation.navigate('DocScanner');
  };
  return (
    <View>
      <ScrollView horizontal>
        {RecordScannedImages
          ? RecordScannedImages.map((uri, index) => (
              <View
                key={uri}
                style={{
                  marginHorizontal: 5,
                  marginBottom: 10,
                  position: 'relative',
                }}>
                <TouchableOpacity
                  onPress={() =>
                    handleImagePress(RecordScannedImages, index, false)
                  }>
                  <FastImage
                    style={{
                      width: 120,
                      height: 160,
                    }}
                    source={{
                      uri: uri,
                      priority: FastImage.priority.normal,
                    }}
                    alt={`image from url`}
                    resizeMode={FastImage.resizeMode.contain}
                    borderWidth={3}
                    borderColor={'orange.400'}
                  />
                </TouchableOpacity>
                {/* //remove images from imageContext */}
                {/* <CloseIcon
              onPress={() => removeImage(index)}
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                zIndex: 1,
                backgroundColor: 'orange',
                borderRadius: 50,
                borderWidth: 2,
                borderColor: 'black',
              }}
              size="5"
              color="black"
            /> */}
              </View>
            ))
          : newScannedImages.map((uri, index) => (
              <View
                key={uri}
                style={{
                  marginHorizontal: 5,
                  marginBottom: 10,
                  position: 'relative',
                }}>
                <TouchableOpacity
                  onPress={() => handleImagePress(uri, index, true)}>
                  <FastImage
                    style={{
                      width: 120,
                      height: 160,
                    }}
                    source={{
                      uri: uri,
                      priority: FastImage.priority.normal,
                    }}
                    alt={`image from local storage`}
                    resizeMode={FastImage.resizeMode.contain}
                    borderWidth={3}
                    borderColor={'orange.400'}
                  />
                </TouchableOpacity>
              </View>
            ))}
        <TouchableOpacity onPress={onAddImage}>
          <View
            style={{
              width: 120,
              height: 160,
              marginHorizontal: 5,
              marginBottom: 10,
              backgroundColor: 'lightgray',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 26}}>+</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ImageGallery;
