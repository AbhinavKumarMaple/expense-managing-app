import {
  Image,
  Text,
  Box,
  ScrollView,
  Container,
  VStack,
  Pressable,
  HStack,
  Spinner,
} from 'native-base';
import ProfilePic from '../../assets/expense-management/Screenbuttons.icon/ProfileButton-WhiteBG.png';
import ProfileScreenUpdateCheckbutton from '../../assets/expense-management/Screenbuttons.icon/ProfileScreen-UpdateCheckbutton.icon.png';
import ProfileScreenLanguage from '../../assets/expense-management/Screenbuttons.icon/ProfileScreen-Languagebutton.icon.png';
import ProfileCurrency from '../../assets/expense-management/Screenbuttons.icon/ProfileScreen-Currency.icon.png';
import ProfileScreenBill from '../../assets/expense-management/Screenbuttons.icon/ProfileScreen-BillType.icon.png';

import TabNavigation from '../../componenets/Profile/TabNavigation';
import withAuthenticationValidation from '../utils/withAuthenticationValidation';
//Firebase
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {useEffect, useState} from 'react';
//App info
import {AppInfo} from '../utils/appInfo';
import {useLanguage} from '../utils/useLang';

//Animation
import * as Animatable from 'react-native-animatable';
import InterstitialAdComponent from '../../componenets/InterstitialAdComponent';
import {useImageContext} from '../../componenets/ImageContext';

const buttons = [ProfileScreenBill, ProfileCurrency, ProfileScreenLanguage];

const ProfileScreen = ({navigation}) => {
  //Logout user
  const handleLogout = () => {
    navigation.navigate('EditProfile');
  };

  useEffect(() => {
    getUsername();
    GetAppInfo();
    //remove code below lines
  }, []);

  // const currentUser = auth().currentUser;
  // const name = currentUser.displayName;
  //Get username from auth
  const [username, setUsername] = useState('');
  const [useremail, setUsereEail] = useState('');

  async function getUsername() {
    const currentUser = auth().currentUser;
    if (currentUser) {
      setUsername(currentUser.displayName);
      setUsereEail(currentUser.email);
    }
  }

  //App info
  const version = AppInfo.version;
  const date = AppInfo.date;
  const name = AppInfo.name;

  //Check App info
  const GetAppInfo = async () => {
    try {
      setAnimationState(true);
      const snapshot = await firestore().collection('info').doc('info').get();
      const data = snapshot.data();

      if (parseFloat(AppInfo.version) < parseFloat(data?.version)) {
        console.log('New version available');
        setUpdateAvailable(true);
      } else {
        console.log('App updated');

        setUpdateAvailable(false);
      }
      setAnimationState(false);
    } catch (error) {
      console.log(error);
      setAnimationState(false);
    }
  };

  //Animation States
  const [animationState, setAnimationState] = useState(false);
  //state for update Available
  const [updateAvailable, setUpdateAvailable] = useState(false);

  //change language hook
  const {t} = useLanguage();

  //context for Count to load ads
  const {count, setCount} = useImageContext();

  return (
    <>
      {count > 2 ? <InterstitialAdComponent /> : null}
      <Box flex="1" safeAreaTop>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <VStack
            justifyContent="space-between"
            alignItems="center"
            py={5}
            space={50}
            h="100%"
            w="100%">
            <Container justifyContent="center" alignItems="center">
              <Pressable
                onPress={handleLogout}
                justifyContent="center"
                alignItems="center">
                <Image source={ProfilePic} alt="price picture" size="xl" />
                <Text isTruncated maxW="40" w="80%" fontSize="xl">
                  {username ? username : 'Name'}
                </Text>
                <Text isTruncated maxW="40" w="80%" fontSize="xl">
                  {useremail ? useremail : 'Email'}
                </Text>
              </Pressable>
            </Container>
            <Container
              flexDirection="row"
              justifyContent="space-between"
              w="100%">
              <Pressable
                onPress={() => navigation.navigate('BillCreationComponent')}>
                <Image source={buttons[0]} alt="category" size="sm" />
              </Pressable>
              <Pressable onPress={() => navigation.navigate('CurrencyScreen')}>
                <Image source={buttons[1]} alt="currency" size="sm" />
              </Pressable>
              <Pressable onPress={() => navigation.navigate('Language')}>
                <Image source={buttons[2]} alt="language" size="sm" />
              </Pressable>
            </Container>
            <HStack
              justifyContent="space-between"
              alignItems="center"
              px="10%"
              w={'100%'}>
              <Box>
                <Text
                  fontSize="md"
                  isTruncated
                  maxW="48"
                  style={{color: updateAvailable ? 'red' : 'black'}}>
                  {t('expense&bills')}: v{version}
                </Text>
                <Text fontSize="md" isTruncated maxW="48">
                  {t('last-update')}: {date}
                </Text>
                <Text fontSize="md" color="#FF701B" isTruncated maxW="48">
                  {name}
                </Text>
              </Box>
              <Pressable onPress={() => GetAppInfo()}>
                {animationState ? (
                  <Animatable.Image
                    animation={{
                      from: {rotate: '360deg'},
                      to: {rotate: '0deg'},
                    }}
                    easing="linear"
                    iterationCount="infinite"
                    direction="normal" // Change to "reverse" for right to left rotation
                    source={ProfileScreenUpdateCheckbutton}
                    alt="check update"
                    style={{width: 50, height: 50}}
                  />
                ) : (
                  <Image
                    source={ProfileScreenUpdateCheckbutton}
                    alt="check update"
                    style={{width: 50, height: 50}}
                  />
                )}
              </Pressable>
            </HStack>
          </VStack>
        </ScrollView>
        <TabNavigation />
      </Box>
    </>
  );
};

export default withAuthenticationValidation(ProfileScreen);
