import {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Input,
  HStack,
  Box,
  VStack,
  Text,
  Pressable,
  Spinner,
  useToast,
} from 'native-base';
import ImageGallery from '../../componenets/ImageGallery';
import firestore from '@react-native-firebase/firestore';
import BannerAd from '../../componenets/BannerAd';
import Tab from '../../componenets/Record/Tab';
import Menu from '../../assets/Record_Screen-BillType.icon.png';
import calendar from '../../assets/Record_Screen-BillDate.icon.png';
import Shop from '../../assets/Record_Screen-ShopName.icon.png';
import desc from '../../assets/Record_Screen-BillDetailsicon.png';
import withAuthenticationValidation from '../utils/withAuthenticationValidation';
import {firebase} from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {useImageContext} from '../../componenets/ImageContext';
import DatePicker from 'react-native-date-picker';
//ads

//waiting lottie
import LottieView from 'lottie-react-native';
//icon import
import {iconsList} from '../utils/IconsList';

//screen re-render
import {useIsFocused} from '@react-navigation/native';
import {
  Image,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import {VirtualizedList} from 'react-native';
import showCustomToast from '../../componenets/Toast';
import {useLanguage} from '../utils/useLang';
import InterstitialAdComponent from '../../componenets/InterstitialAdComponent';

const RecordScreen = ({navigation, route}) => {
  //lang hook
  const {t, changeLanguage, languagesList} = useLanguage();

  //Toast
  const toast = useToast();

  //default icon array size
  iconSize = 55;

  // console.log('record:', route.params?.record);
  const {newScannedImages, setNewScannedImages} = useImageContext();
  //States for date componenet
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const handleDateChange = date => {
    setOpen(false);
    setDate(selectedDate);
    // Handle your logic here
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [isLoadingMore, setLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    route?.params?.CategoryName || '',
  );

  const [SelectedCategoryId, setSelectedCategoryId] = useState();
  const [SelectedIconName, setSelectedIconName] = useState(iconsList[1].Icon);
  //Icon useState
  const [selectedIcon, setSelectedIcon] = useState();

  //re-render
  const isFocused = useIsFocused();

  const scannedImages = newScannedImages;

  const user = firebase.auth().currentUser;
  // console.log('category :', categories[0]['categoryId']);
  useEffect(() => {
    fetchCategories();
  }, [isFocused]);

  //handle Category Selection from select:
  const handleCategorySelect = value => {
    // setSelectedCategory(value);
    console.log('record:', value);
    // Find the category object that matches the selected categoryName
    try {
      setSelectedCategory(value.categoryName);
      setSelectedCategoryId(value.categoryId);
      setSelectedIcon(value.iconName);
      setSelectedIconName(iconsList[value.iconName].Icon);
    } catch (error) {
      console.error(error);
    }
  };

  //handle pagination:
  const fetchMoreCategories = async () => {
    if (lastVisible && !isLoadingMore) {
      setLoadingMore(true);

      try {
        const querySnapshot = await firestore()
          .collection('users')
          .doc(user.uid)
          .collection('categories')
          .orderBy('updatedAt')
          .startAfter(lastVisible)
          .limit(4)
          .get();

        if (querySnapshot.docs.length > 0) {
          const newCategoriesData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              categoryName: data.categoryName,
              iconName: data.iconName,
              categoryId: doc.id,
            };
          });

          setCategories(prevCategories => [
            ...prevCategories,
            ...newCategoriesData,
          ]);

          const newLastVisible =
            querySnapshot.docs[querySnapshot.docs.length - 1];
          setLastVisible(newLastVisible);
        } else {
          setLastVisible(null);
        }

        setLoadingMore(false);
      } catch (error) {
        console.error('Error fetching more categories:', error);
        setLoadingMore(false);
      }
    }
  };

  //Fetch firestore data on Category
  const fetchCategories = async () => {
    try {
      const querySnapshot = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('categories')
        .orderBy('updatedAt')
        .limit(14)
        .get();

      const categoriesData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          categoryName: data.categoryName,
          iconName: data.iconName,
          categoryId: doc.id,
        };
      });
      setCategories(categoriesData);
      if (querySnapshot.docs.length > 0) {
        const newLastVisible =
          querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastVisible(newLastVisible);
      } else {
        setLastVisible(null);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const [inputValues, setInputValues] = useState({
    amount: '',
    category: '',
    date: '',
    shopName: '',
    description: '',
  });

  //data coming from listing Screen

  const record = route.params?.record || {};
  const {recordDate} = route.params?.record || {};

  useEffect(() => {
    // Set the initial values based on the route params if available
    setInputValues({
      amount: record.amount || '',
      category: record.category?.categoryName || '',
      date: recordDate || '',
      shopName: record.shopName || '',
      description: record.description || '',
    });
    console.log('input', inputValues);
    setDate(recordDate ? new Date(recordDate) : new Date());
    setSelectedCategory(record.category?.categoryName || '');
    setSelectedCategoryId(record.category?.categoryID || '');
    setSelectedIconName(
      record.category?.IconName ? iconsList[record.category.IconName].Icon : '',
    );

    if (record.scannedImages) {
      setNewScannedImages(record.scannedImages);
    }
  }, [route.params]);

  // console.log('IconList:', iconsList[1].Icon);
  const handleUploadToFirestore = async () => {
    try {
      if (!scannedImages.length) {
        showCustomToast({
          title: 'Please select at least one image',
          status: 'error',
          toast,
          id: 'test-toast',
        });
        return;
      }

      if (!inputValues.amount) {
        showCustomToast({
          title: 'Please enter the amount',
          status: 'error',
          toast,
          id: 'test-toast',
        });
        return;
      }

      if (
        !selectedCategory ||
        !SelectedCategoryId ||
        !SelectedIconName | !selectedIcon
      ) {
        showCustomToast({
          title: 'Please select a category',
          status: 'error',
          toast,
          id: 'test-toast',
        });
        return;
      }

      if (!date) {
        showCustomToast({
          title: 'Please select a date',
          status: 'error',
          toast,
          id: 'test-toast',
        });
        return;
      }

      if (!inputValues.shopName) {
        showCustomToast({
          title: 'Please enter the shop name',
          status: 'error',
          toast,
          id: 'test-toast',
        });
        return;
      }

      if (!inputValues.description) {
        showCustomToast({
          title: 'Please enter a description',
          status: 'error',
          toast,
          id: 'test-toast',
        });
        return;
      }
      setProgress(true);

      // Update or create the user record
      const userRecordsRef = firestore().collection('users').doc(user.uid);
      await userRecordsRef.set({});

      const userDocRef = firestore().collection('users').doc(user.uid);

      // Update the count for the selected category
      const categoryCountsDocRef = userDocRef
        .collection('categoryCounts')
        .doc('categories');
      const categoryCountsDoc = await categoryCountsDocRef.get();
      const categoryCountsData = categoryCountsDoc.exists
        ? categoryCountsDoc.data()
        : {};

      const categoryCountData = categoryCountsData[SelectedCategoryId] || {
        name: selectedCategory,
        icon: selectedIcon,
        count: 0,
      };

      await categoryCountsDocRef.set({
        ...categoryCountsData,
        [SelectedCategoryId]: {
          ...categoryCountData,
          count: categoryCountData.count + 1,
        },
      });
      console.log('Category count updated:', categoryCountData.count);
      // Upload images to Firebase Storage and get their download URLs
      // Create a reference to Firebase Storage
      const storageRef = storage().ref();

      const imageUrls = [];
      for (const imageUri of scannedImages) {
        const imageName = imageUri.substring(imageUri.lastIndexOf('/') + 1);
        const imageRef = storageRef.child(`images/${user.uid}/${imageName}`);
        await imageRef.putFile(imageUri);
        const imageUrl = await imageRef.getDownloadURL();
        imageUrls.push(imageUrl);
      }
      console.log('image uploded');

      // Add a new record
      const userRecordsCollectionRef = userRecordsRef.collection('records');
      await userRecordsCollectionRef.add({
        scannedImages: imageUrls,
        amount: inputValues.amount,
        category: {
          categoryName: selectedCategory,
          categoryID: SelectedCategoryId,
          IconName: selectedIcon,
        },
        categoryID: SelectedCategoryId,
        date: date,
        shopName: inputValues.shopName,
        description: inputValues.description,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        // Add other fields as needed
      });

      // Clear state and log success
      setNewScannedImages([]);
      setInputValues([]);
      setCategories([]);
      setSelectedCategory('');
      setSelectedCategoryId('');
      setSelectedIconName('');
      setSelectedIcon('');

      console.log('Data uploaded successfully');

      navigation.navigate('HomeScreen');
      setProgress(false);
    } catch (error) {
      // Handle error here
      setNewScannedImages([]);
      setInputValues([]);
      setCategories([]);
      setSelectedCategory('');
      setSelectedCategoryId('');
      setSelectedIconName('');
      setSelectedIcon('');
      console.error('Error uploading data:', error);
      navigation.navigate('HomeScreen');
      setProgress(false);
    }
  };

  //Cancel Fcuntion
  const handleCancel = () => {
    setProgress(false);
    console.log('Cancel');
    setNewScannedImages([]);
    setInputValues([]);
    setCategories([]);
    setSelectedCategory('');
    setSelectedCategoryId('');
    setSelectedIconName('');
    setSelectedIcon('');
    navigation.navigate('HomeScreen');
  };

  //progress usestate and fucntion
  const [progress, setProgress] = useState(false);
  const {count, setCount} = useImageContext();

  return progress ? (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
      }}>
      <LottieView
        source={require('../../assets/lotties/Waiting.json')}
        autoPlay
        loop
        style={{width: 500, height: 500}}
      />
    </View>
  ) : (
    <>
      {count > 2 ? <InterstitialAdComponent /> : null}
      <Box p="3" justifyContent={'space-around'} height="100%" width="100%">
        <ScrollView w="100%">
          <VStack space={1} alignContent={'flex-start'} w={'100%'}>
            <ImageGallery RecordScannedImages={record.scannedImages} />

            <Box
              space={2}
              bg="white"
              borderWidth="3"
              borderColor="orange.400"
              width={'100%'}
              direction={'row'}
              alignItems={'flex-end'}>
              <Input
                bg="white"
                variant={'unstyled'}
                textAlign="right"
                width="auto"
                keyboardType="numeric"
                placeholder={t('number-placeholder')}
                fontSize="xl"
                value={inputValues.amount}
                onChangeText={amount =>
                  setInputValues({...inputValues, amount})
                }
              />
            </Box>
            <HStack
              alignItems={'center'}
              space="2"
              justifyItems={'space-between'}
              w="50%">
              <Pressable
                onPress={() => navigation.navigate('BillCreationComponent')}>
                <Image
                  source={Menu}
                  alt="Cetegory Select"
                  style={{width: iconSize, height: iconSize}}
                />
              </Pressable>
              <Box
                space={2}
                bg="white"
                borderWidth="3"
                borderColor="orange.400"
                width={'100%'}
                direction={'row'}
                alignItems={'center'}>
                <View style={{justifyContent: 'center', height: 40}}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={{
                      borderColor: selectedCategory ? 'orange' : 'gray',
                    }}>
                    <Text
                      textAlign="center"
                      width="auto"
                      fontSize="xl"
                      // bg="orange.400"
                    >
                      {selectedCategory || t('select-category')}
                    </Text>
                  </TouchableOpacity>

                  <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="slide">
                    <TouchableWithoutFeedback
                      onPress={() => setModalVisible(false)}>
                      <View style={{flex: 1}}>
                        <View style={{flex: 1}} />
                        {/* Empty view for top half of screen */}
                        <View
                          style={{
                            flex: 1,
                            borderTopLeftRadius: 50,
                            borderTopRightRadius: 50,
                            backgroundColor: 'white',
                            shadowRadius: 2,
                            shadowOpacity: 10,
                            shadowColor: 'black',
                          }}>
                          <VirtualizedList
                            data={categories}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item}) => (
                              <TouchableOpacity
                                onPress={() => handleCategorySelect(item)}>
                                <Text
                                  style={{
                                    fontSize: 18,
                                    textAlign: 'center',
                                    paddingVertical: 10,
                                  }}>
                                  {item.categoryName}
                                </Text>
                              </TouchableOpacity>
                            )}
                            getItemCount={() => categories.length}
                            getItem={(data, index) => categories[index]}
                            ListFooterComponent={
                              isLoadingMore ? (
                                <Spinner
                                  accessibilityLabel="Loading posts"
                                  color="orange.400"
                                />
                              ) : null
                            }
                            onEndReached={fetchMoreCategories} // Manually trigger fetchMoreCategories
                            onEndReachedThreshold={0.2}
                          />
                          <TouchableOpacity
                            onPress={() => setModalVisible(false)}>
                            <Text
                              style={{
                                textAlign: 'center',
                                paddingVertical: 10,
                                fontSize: 18,
                                color: 'orange',
                              }}>
                              Cancel
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  </Modal>
                </View>
              </Box>

              <Image
                shadow={2}
                source={SelectedIconName}
                alt="Cetegory Image"
                style={{width: iconSize, height: iconSize}}
              />
            </HStack>
            <HStack
              space={2}
              alignItems={'center'}
              justifyItems={'center'}
              // bgColor={'amber.300'}
            >
              <Image
                source={calendar}
                alt="profile image"
                style={{width: iconSize, height: iconSize}}
                resizeMode="center"
              />
              <Box
                alignContent={'center'}
                justifyContent={'center'}
                height={12}
                space={1}
                bg="white"
                borderWidth="3"
                width={'50%'}
                borderColor="orange.400"
                // width={'auto'}
                direction={'row'}
                alignItems={'center'}>
                <DatePicker
                  mode="datetime"
                  modal
                  open={open}
                  date={date}
                  onConfirm={date => {
                    setInputValues({...inputValues, date});
                    setOpen(false);
                    setDate(date);
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />

                <Pressable onPress={() => setOpen(true)}>
                  <Text
                    // maxWidth="90%"

                    textAlign="center"
                    width="auto"
                    placeholder="DATE"
                    fontSize="xl"
                    // onChangeText={date => setInputValues({...inputValues, date})}
                  >
                    {inputValues.date
                      ? inputValues.date.toLocaleDateString()
                      : date.toLocaleDateString()}
                  </Text>
                </Pressable>
              </Box>
            </HStack>
            <HStack space={2} alignItems={'center'} justifyItems={'center'}>
              <Image
                shadow={2}
                source={Shop}
                alt="profile image"
                style={{width: iconSize, height: iconSize}}
              />
              <Box
                flex={1}
                space={1}
                bg="white"
                borderWidth="3"
                borderColor="orange.400"
                direction={'row'}
                alignItems={'center'}>
                <Input
                  bg="white"
                  variant={'unstyled'}
                  alt="shop name"
                  // maxWidth="90%"
                  textAlign="left"
                  width="auto"
                  placeholder={t('shop-name')}
                  fontSize="xl"
                  value={inputValues.shopName}
                  onChangeText={shopName =>
                    setInputValues({...inputValues, shopName})
                  }
                />
              </Box>
            </HStack>
            <HStack
              space={2}
              direction={'row'}
              alignItems={'center'}
              justifyItems={'center'}>
              <Image
                shadow={2}
                source={desc}
                alt="profile image"
                style={{width: iconSize, height: iconSize}}
                resizeMode="cover"
              />
              <Box
                flex={1}
                space={1}
                bg="white"
                borderWidth="3"
                borderColor="orange.400"
                width={'80%'}
                height={'auto'}
                direction={'row'}
                alignItems={'center'}>
                <Input
                  bg="white"
                  variant="unstyled"
                  placeholder={t('description')}
                  value={inputValues.description}
                  onChangeText={description =>
                    setInputValues({...inputValues, description})
                  }
                  fontSize="xl"
                />
              </Box>
            </HStack>
            {/* <Button onPress={handleUploadToFirestore}>Upload to Firestore</Button> */}
          </VStack>
        </ScrollView>
        <Box>
          <BannerAd />
        </Box>
        <Box width={'100%'}>
          <Tab HandleSubmit={handleUploadToFirestore} Cancel={handleCancel} />
        </Box>
      </Box>
    </>
  );
};

export default withAuthenticationValidation(RecordScreen);
