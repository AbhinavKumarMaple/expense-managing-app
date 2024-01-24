import {HStack, Image, Box, Pressable, ZStack, Center, Text} from 'native-base';
import Camera from '../../assets/expense-management/Screenbuttons.icon/E&BLogo-OrangeWhiteBG.png';
import Listing from '../../assets/expense-management/Screenbuttons.icon/ListingButton-WhiteBG.png';
import Profile from '../../assets/expense-management/Screenbuttons.icon/ProfileButton-WhiteBG.png';
import Background from '../../assets/HomeScreen.jpeg';
import {useNavigation} from '@react-navigation/native'; // Import the hook
import withAuthenticationValidation from '../utils/withAuthenticationValidation';
import {useLanguage} from '../utils/useLang';
import {useImageContext} from '../../componenets/ImageContext';
import InterstitialAdComponent from '../../componenets/InterstitialAdComponent';

const HomeScreen = () => {
  const navigation = useNavigation(); // Get the navigation object

  //useLanguage hook
  const {t} = useLanguage();

  //context for Count to load ads
  const {count, setCount} = useImageContext();

  return (
    <>
      {count > 2 ? <InterstitialAdComponent /> : null}
      <ZStack flex={1}>
        <Image
          source={Background}
          alt="Background Image"
          alignItems={'flex-start'}
          // resizeMode="cover"
          // position="initial"
          top={0}
          left={0}
          width="100%"
          height="100%"
          // zIndex={-1}
          right={10} // Adjust this value to change the offset from the right side
          center // Centers the image vertically
        />

        <Box
          pb={5}
          h={'100vp'}
          justifyContent="space-between"
          alignItem="center"
          w={'100%'}
          position={'absolute'}
          bottom={'0%'}
          bg={'transparent'}>
          <Box bg={'transparent'}>
            <Text
              fontSize="4xl"
              fontWeight="normal"
              color="white"
              justifyContent="space-between"
              alighItem="center"
              textAlign="center"
              backgroundColor={'red.400'}>
              {t('expense&bills')}
            </Text>
            <Text
              fontSize="2xl"
              fontWeight="normal"
              color="white"
              justifyContent="space-between"
              alighItem="center"
              textAlign="center"
              pb="4"
              backgroundColor={'red.400'}>
              {t('snap-file')}
            </Text>
            <HStack
              justifyContent="space-between"
              px={'10%'}
              bg={'transparent'}>
              <Pressable onPress={() => navigation.navigate('ListingScreen')}>
                <Image source={Listing} alt="Image 1" size="sm" />
              </Pressable>
              <Pressable onPress={() => navigation.navigate('DocScanner')}>
                <Image source={Camera} alt="Image 2" size="sm" />
              </Pressable>
              <Pressable onPress={() => navigation.navigate('ProfileScreen')}>
                <Image source={Profile} alt="Image 3" size="sm" />
              </Pressable>
            </HStack>
          </Box>
        </Box>
      </ZStack>
    </>
  );
};

export default withAuthenticationValidation(HomeScreen);
