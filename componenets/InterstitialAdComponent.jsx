import {useEffect, useState} from 'react';
import {
  InterstitialAd,
  TestIds,
  AdEventType,
} from 'react-native-google-mobile-ads';
import {useImageContext} from './ImageContext';

const adUnitId = TestIds.INTERSTITIAL;
const interstitial = InterstitialAd.createForAdRequest(adUnitId);

const InterstitialAdComponent = () => {
  const {count, setCount} = useImageContext();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Subscribe to Ad events
    const adEventListener = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
      },
    );

    // Start loading the Interstitial Ad straight away
    interstitial.load();

    // Cleanup event listener on component unmount
    return adEventListener;
  }, []); // No dependencies, run only once on mount

  useEffect(() => {
    const showInterstitialAd = () => {
      // Show the Interstitial Ad
      interstitial.show();
    };

    // Check if the count is 3 and show the Interstitial Ad
    if (count === 3 && loaded) {
      showInterstitialAd();
      // Reset count to 0 after showing the Interstitial Ad
      setCount(0);
    }
  }, [count, loaded, setCount]); // Only include variables directly used inside the useEffect

  return null; // This component doesn't render anything directly
};

export default InterstitialAdComponent;
