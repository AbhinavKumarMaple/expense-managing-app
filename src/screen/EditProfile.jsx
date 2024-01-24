import React, {useState, useEffect} from 'react';
import {
  Box,
  VStack,
  Text,
  Input,
  Button,
  Pressable,
  HStack,
  Spinner,
  View,
} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useLanguage} from '../utils/useLang';
import InterstitialAdComponent from '../../componenets/InterstitialAdComponent';
import {useImageContext} from '../../componenets/ImageContext';

function EditProfile({navigation}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const [updatingUsername, setUpdatingUsername] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [updatingEmail, setUpdatingEmail] = useState(false);

  //lang hook
  const {t, changeLanguage, languagesList} = useLanguage();

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      setUsername(user.displayName || '');
      setEmail(user.email || '');
    }
  }, []);

  const handleUpdateUsername = async () => {
    try {
      setUpdatingUsername(true);
      const user = auth().currentUser;

      if (user) {
        await user.updateProfile({displayName: username});
        await firestore()
          .collection('users')
          .doc(user.uid)
          .update({username: username});
        setUpdatingUsername(false);
      }
    } catch (error) {
      console.error('Error updating username:', error);
      setUpdatingUsername(false);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      setUpdatingPassword(true);
      const user = auth().currentUser;

      if (user) {
        await user.updatePassword(password);
        setUpdatingPassword(false);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setUpdatingPassword(false);
    }
  };

  const handleUpdateEmail = async () => {
    try {
      setUpdatingEmail(true);
      const user = auth().currentUser;

      if (user) {
        await user.updateEmail(email);
        setUpdatingEmail(false);
      }
    } catch (error) {
      console.error('Error updating email:', error);
      setUpdatingEmail(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.navigate('SignIn');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const renderUpdaterButton = (onPress, loading) => {
    return (
      <Pressable onPress={onPress} disabled={loading}>
        <HStack space="2" alignItems="center">
          {loading ? (
            <Spinner size="sm" color="orange.400" />
          ) : (
            <Icon name="check" size={20} color="orange" />
          )}
        </HStack>
      </Pressable>
    );
  };
  const {count, setCount} = useImageContext();

  return (
    <>
      {count > 2 ? <InterstitialAdComponent /> : null}
      <VStack flex={1} px="5" py="10" justifyContent="space-between">
        <VStack space="5" alignItems="center">
          <Text fontSize="xl">{t('user-profile')}</Text>
          <HStack space="5" alignItems="center" justifyContent="space-between">
            <Input
              placeholder={t('username')}
              value={username}
              onChangeText={name => setUsername(name)}
              borderColor={'#FFA500'}
              borderWidth="1"
              flex={1}
              InputLeftElement={
                <Icon
                  name="person"
                  size={20}
                  color="muted.400"
                  style={{marginLeft: 10}}
                />
              }
            />
            {renderUpdaterButton(handleUpdateUsername, updatingUsername)}
          </HStack>

          <HStack space="5" alignItems="center" justifyContent="space-between">
            <Input
              placeholder={t('password')}
              value={password}
              onChangeText={newPassword => setPassword(newPassword)}
              borderColor={'#FFA500'}
              borderWidth="1"
              flex={1}
              secureTextEntry={false}
              InputLeftElement={
                <Icon
                  name="lock"
                  size={20}
                  color="muted.400"
                  style={{marginLeft: 10}}
                />
              }
            />
            {renderUpdaterButton(handleUpdatePassword, updatingPassword)}
          </HStack>

          <HStack space="5" alignItems="center" justifyContent="space-between">
            <Input
              placeholder={t('email')}
              value={email}
              onChangeText={newEmail => setEmail(newEmail)}
              borderColor={'#FFA500'}
              borderWidth="1"
              flex={1}
              InputLeftElement={
                <Icon
                  name="mail"
                  size={20}
                  color="muted.400"
                  style={{marginLeft: 10}}
                />
              }
            />
            {renderUpdaterButton(handleUpdateEmail, updatingEmail)}
          </HStack>
        </VStack>

        <Button onPress={handleLogout}>
          <Text>{t('logout')}</Text>
        </Button>
      </VStack>
    </>
  );
}

export default EditProfile;
