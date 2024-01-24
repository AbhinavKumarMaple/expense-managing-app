import withAuthenticationValidation from '../../src/utils/withAuthenticationValidation';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Input,
  Button,
  Box,
  Spinner,
  Center,
  ScrollView,
  Pressable,
} from 'native-base';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useLanguage} from '../../src/utils/useLang';

const ItemsPerPage = 20;

const BillType = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const user = firebase.auth().currentUser;
  const [categoryName, setCategoryName] = useState('');
  // const [iconName, setIconName] = useState('');
  const [categories, setCategories] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allDataFetched, setAllDataFetched] = useState(false);

  //custom language hook
  const {t, changeLanguage, languagesList} = useLanguage();

  useEffect(() => {
    fetchInitialData();
    const initialBillType = route.params?.selectedBillType || '';
    setCategoryName(initialBillType);
  }, [route.params?.selectedBillType]);

  const fetchInitialData = async () => {
    setIsLoading(true);

    try {
      const querySnapshot = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('categories')
        .orderBy('categoryName') // Adjust this as needed
        .limit(ItemsPerPage)
        .get();

      const categoriesData = querySnapshot.docs.map(doc => doc.data());
      setCategories(categoriesData);

      if (querySnapshot.docs.length > 0) {
        const lastVisibleDoc =
          querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastVisible(lastVisibleDoc);
      } else {
        setAllDataFetched(true); // No more data to fetch
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  const fetchMoreData = async () => {
    if (isLoading || allDataFetched) {
      return; // Don't fetch if already loading or all data fetched
    }

    setIsLoading(true);

    try {
      if (lastVisible) {
        const querySnapshot = await firestore()
          .collection('users')
          .doc(user.uid)
          .collection('categories')
          .orderBy('categoryName') // Adjust this as needed
          .startAfter(lastVisible)
          .limit(7)
          .get();

        const newCategoriesData = querySnapshot.docs.map(doc => doc.data());
        setCategories(prevCategories => [
          ...prevCategories,
          ...newCategoriesData,
        ]);

        if (querySnapshot.docs.length > 0) {
          const newLastVisible =
            querySnapshot.docs[querySnapshot.docs.length - 1];
          setLastVisible(newLastVisible);
        } else {
          setAllDataFetched(true); // No more data to fetch
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching more data:', error);
      setIsLoading(false);
    }
  };

  const handleCreateSavedCategory = async Category => {
    try {
      navigation.navigate('BillCreationComponent', {
        defaultBillType: categoryName ? categoryName : Category,
      });

      // You can navigate or show a success message here
    } catch (error) {
      console.error('Error creating category:', error);
      // Handle error here
    }
  };

  const handleScrollEnd = ({nativeEvent}) => {
    const offsetY = nativeEvent.contentOffset.y;
    const contentHeight = nativeEvent.contentSize.height;
    const visibleHeight = nativeEvent.layoutMeasurement.height;

    if (!isLoading && offsetY + visibleHeight >= contentHeight) {
      fetchMoreData();
    }
  };

  return (
    <View p={4} height="100%">
      <Text fontSize="xl" mb={4}>
        {t('create-a-new-category')}
      </Text>
      <Input
        placeholder={t('category-name')}
        mb={2}
        value={categoryName}
        onChangeText={setCategoryName}
      />

      <Button
        _pressed={{
          _text: {
            bg: 'orange.400',
            color: 'white',
          },
        }}
        _text={{color: 'orange.400'}}
        onPress={handleCreateSavedCategory}
        mb={4}>
        {t('done')}
      </Button>
      <Text fontSize="xl" mb={4} color="orange.400">
        {t('bill-type')}
      </Text>
      <View height="60%" overflow={'hidden'}>
        <ScrollView
          onScrollEndDrag={handleScrollEnd}
          showsVerticalScrollIndicator={false}>
          {categories.map((category, index) => (
            <Pressable
              onPress={() => handleCreateSavedCategory(category.categoryName)}
              key={index}>
              <Box key={index} bg="gray.200" p={3} my={2} rounded="md">
                {category.categoryName && <Text>{category.categoryName}</Text>}
              </Box>
            </Pressable>
          ))}
          {isLoading && (
            <Center my={4}>
              <Spinner
                accessibilityLabel="Loading categories"
                color="orange.400"
              />
            </Center>
          )}
          {allDataFetched && !isLoading && (
            <Center my={4}>
              <Text>{t('no-more-categories')}</Text>
            </Center>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default withAuthenticationValidation(BillType);
