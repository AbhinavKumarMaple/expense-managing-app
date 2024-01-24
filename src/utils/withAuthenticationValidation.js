import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const withAuthenticationValidation = WrappedComponent => {
  return props => {
    const navigation = useNavigation();
    const route = useRoute();
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(true);

    const validateAndNavigate = async screenName => {
      const user = auth().currentUser;
      if (!user) {
        navigation.navigate('SignIn'); // User is not logged in
      }
      try {
        await user.reload(); // Refresh user data to check if it still exists
      } catch (error) {
        setIsUserLoggedIn(false); // User no longer exists in Firebase
        navigation.navigate('SignIn');
      }
      return null;
    };

    useEffect(() => {
      const validatedScreen = validateAndNavigate(WrappedComponent.name);
      if (validatedScreen === 'SignIn') {
        navigation.navigate('SignIn');
      }
    }, []);

    if (!isUserLoggedIn) {
      return null; // User no longer exists in Firebase, don't render component
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuthenticationValidation;
