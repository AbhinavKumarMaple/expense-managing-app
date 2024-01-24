import {NativeBaseProvider} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';

import DocScanner from './src/screen/DocScanner';
import RecordScreen from './src/screen/RecordScreen';
import {ImageProvider} from './componenets/ImageContext';
import ImageGallery from './componenets/ImageGallery';
import ImageDetailScreen from './componenets/ImageDetailScreen';
import Temp from './src/screen/Temp';
import BillCreationComponent from './src/screen/BillCreationComponent';
import SignInScreen from './src/screen/SignIn';
import SignUpScreen from './src/screen/SignUp';
import theme from './src/Theme/NativeBaseTheme';

import ProfileScreen from './src/screen/ProfileScreen';
import CurrencyScreen from './src/screen/CurrencyScreen';
import ListingScreen from './src/screen/ListingScreen';
import HomeScreen from './src/screen/HomeScreen';
import Language from './src/screen/Language';
import BillType from './componenets/BillCreation/BillType';
import {useEffect, useState} from 'react';
import EditProfile from './src/screen/EditProfile';

const Stack = createStackNavigator();

const App = () => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <ImageProvider>
      <NativeBaseProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={user ? 'HomeScreen' : 'SignIn'}
            // initialRouteName={'SignIn'}
            screenOptions={{
              headerShown: false,
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}>
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />

            <Stack.Screen name="DocScanner" component={DocScanner} />
            <Stack.Screen name="RecordScreen" component={RecordScreen} />
            <Stack.Screen name="ImageGallery" component={ImageGallery} />
            <Stack.Screen name="Temp" component={Temp} />
            <Stack.Screen
              name="BillCreationComponent"
              component={BillCreationComponent}
            />
            <Stack.Screen
              name="ImageDetailScreen"
              component={ImageDetailScreen}
            />

            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="CurrencyScreen" component={CurrencyScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="ListingScreen" component={ListingScreen} />
            <Stack.Screen name="Language" component={Language} />
            <Stack.Screen name="BillType" component={BillType} />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </ImageProvider>
  );
};

export default App;
