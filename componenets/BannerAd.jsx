import {AspectRatio, Box, Center, Container, Image, Text} from 'native-base';
import {useEffect} from 'react';
import {Dimensions} from 'react-native';
import mobileAds, {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

const bannerAd = () => {
  useEffect(() => {
    // Initialize the Google Mobile Ads SDK
    initializeAds();
  }, []);

  const initializeAds = async () => {
    try {
      // const {platform} = await import('react-native').then(m => m.Platform);

      // // Set your actual AdMob App ID
      // const appId =
      //   platform === 'ios' ? 'your-ios-app-id' : 'your-android-app-id';

      // Initialize the Google Mobile Ads SDK
      await mobileAds().initialize();
    } catch (error) {
      console.error('Error initializing ads:', error);
    }
  };
  return (
    <Center>
      <BannerAd
        unitId={TestIds.BANNER}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </Center>
  );
};

export default bannerAd;
