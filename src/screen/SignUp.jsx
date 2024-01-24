import React, {useState} from 'react';
import {Box, Center, VStack, Text, Input, Button, Pressable} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the MaterialIcons icon library
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useLanguage} from '../utils/useLang';

function SignUpScreen({navigation}) {
  //lang state
  const {t, changeLanguage, languagesList} = useLanguage();

  const [value, setValue] = useState({
    email: '',
    password: '',
    error: '',
  });

  const [username, setUsername] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  async function handleSignUp() {
    if (!value.email || !value.password || !username) {
      setValue({...value, error: 'All fields are required.'});
      return;
    }

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(value.email)) {
      setValue({...value, error: 'Invalid email address.'});
      return;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        value.email,
        value.password,
      );
      const user = userCredential.user;

      await firestore().collection('users').doc(user.uid).set({
        email: value.email,
        username: username,
      });

      setValue({...value, error: 'User account created & signed in!'});

      await auth()
        .signInWithEmailAndPassword(value.email, value.password)
        .then(() => {
          auth().currentUser.updateProfile({
            displayName: username,
          });
          navigation.navigate('HomeScreen');
        });
    } catch (error) {
      setValue({
        ...value,
        error: error.message,
      });
    }
  }

  return (
    <Box px="5">
      <Center height={'100%'}>
        <VStack space={'5'} p={'2'} alignItems="center" justifyItems={'center'}>
          <Text>{t('signup')}</Text>
          <Input
            placeholder={t('email')}
            value={value.email}
            onChangeText={email => setValue({...value, email, error: ''})}
            keyboardType="email-address"
            borderColor={'#FFA500'}
            borderWidth="1"
            _focus={{
              borderColor: 'orange.400',
              borderWidth: 2,
              bgColor: {},
            }}
            InputLeftElement={
              <Icon
                name="email"
                size={20}
                color="muted.400"
                style={{marginLeft: 10}}
              />
            }
          />

          <Input
            placeholder={t('username')}
            value={username}
            onChangeText={name => setUsername(name)}
            borderColor={'#FFA500'}
            borderWidth="1"
            _focus={{
              borderColor: 'orange.400',
              borderWidth: 2,
              bgColor: {},
            }}
            InputLeftElement={
              <Icon
                name="person"
                size={20}
                color="muted.400"
                style={{marginLeft: 10}}
              />
            }
          />

          <Input
            placeholder={t('password')}
            borderColor={'#FFA500'}
            borderWidth="1"
            value={value.password}
            onChangeText={password => setValue({...value, password, error: ''})}
            secureTextEntry={!passwordVisible}
            _focus={{
              borderColor: 'orange.400',
              borderWidth: 2,
              bgColor: {},
            }}
            InputRightElement={
              <Pressable onPress={() => setPasswordVisible(!passwordVisible)}>
                <Icon
                  name={passwordVisible ? 'visibility' : 'visibility-off'}
                  size={20}
                  color="muted.400"
                  style={{marginRight: 10}}
                />
              </Pressable>
            }
          />

          <Button block bg={'orange.400'} onPress={handleSignUp}>
            <Text bg="orange.400">{t('signup')}</Text>
          </Button>
          {value.error ? (
            <Text style={{color: 'red'}}>{value.error}</Text>
          ) : null}
        </VStack>
        <Button
          variant={'ghost'}
          onPress={() => navigation.navigate('SignIn')}
          my="4">
          <Text underline>{t('already-have-an-account')}</Text>
        </Button>
      </Center>
    </Box>
  );
}

export default SignUpScreen;
