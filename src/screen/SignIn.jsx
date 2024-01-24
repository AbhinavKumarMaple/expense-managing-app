import React, {useState} from 'react';

import {
  Box,
  Center,
  VStack,
  Text,
  Input,
  Button,
  Stack,
  Pressable,
} from 'native-base';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native'; // Import the hook
//Firebase
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';
import {useLanguage} from '../utils/useLang';

function SignInScreen() {
  const [value, setValue] = useState({
    email: '',
    password: '',
    error: '',
  });

  const navigation = useNavigation();

  const [showPassword, setShowPassword] = useState(false);

  async function handleSignIn() {
    if (!value.email || !value.password) {
      setValue({...value, error: 'Both fields are required.'});
      return;
    }

    // Check email format using regular expression
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(value.email)) {
      setValue({...value, error: 'Invalid email address.'});
      return;
    }
    try {
      await auth()
        .signInWithEmailAndPassword(value.email, value.password)
        .then(() => {
          // console.log('User account created & signed in!');
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            // console.log('That email address is already in use!');
          }
          if (error.code === 'auth/invalid-email') {
            // console.log('That email address is invalid!');
          }
          // console.error(error);
        });
      navigation.replace('HomeScreen');
      // navigation.navigate('HomeScreen');
    } catch (error) {
      setValue({
        ...value,
        error: error.message,
      });
    }
    // try {

    // } catch (error) {
    //   setValue({
    //     ...value,
    //     error: error.message,
    //   });
    // }
  }

  //lang hook
  const {t, changeLanguage, languagesList} = useLanguage();

  return (
    <Box>
      <Center height={'100%'}>
        <VStack space={'5'} p={'2'} alignItems="center">
          <Text>{t('signin')}</Text>
          <Stack space={4} w="100%" alignItems="center">
            <Input
              w={{
                base: '75%',
                md: '25%',
              }}
              value={value.email}
              onChangeText={email => setValue({...value, email})}
              keyboardType="email-address"
              InputLeftElement={
                <Icon
                  name="email-outline"
                  size={20}
                  color="black"
                  style={{marginLeft: 10, marginRight: 10}}
                />
              }
              _focus={{
                borderColor: 'orange.400',
                borderWidth: 2,
              }}
              placeholder={t('email')}
            />
            <Input
              w={{
                base: '75%',
                md: '25%',
              }}
              value={value.password}
              onChangeText={password =>
                setValue({...value, password, error: ''})
              }
              secureTextEntry={!showPassword}
              InputRightElement={
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={{padding: 8}}>
                  <Icon
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="black"
                    style={{marginLeft: 10, marginRight: 10}}
                  />
                </Pressable>
              }
              _focus={{
                borderColor: 'orange.400',
                borderWidth: 2,
              }}
              placeholder={t('password')}
            />
          </Stack>
          <Button block bg={'orange.400'} onPress={handleSignIn}>
            <Text bg="orange.400" color="white">
              {t('signin')}
            </Text>
          </Button>
          {value.error ? (
            <Text style={{color: 'red'}}>{value.error}</Text>
          ) : null}
        </VStack>
        <Button
          variant={'ghost'}
          onPress={() => navigation.navigate('SignUp')}
          my="4">
          <Text underline>{t('already-have-an-account')}</Text>
        </Button>
      </Center>
    </Box>
  );
}

export default SignInScreen;
