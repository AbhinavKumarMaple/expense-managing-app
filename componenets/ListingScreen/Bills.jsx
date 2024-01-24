import React, {useState, useEffect} from 'react';
import {View, HStack, Pressable, Text, Image, Spinner} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';
import {ScrollView} from 'react-native';
import {iconsList} from '../../src/utils/IconsList';

const ItemsPerPage = 10;

const Bills = ({selectedFilter, dateRange}) => {
  const user = firebase.auth().currentUser;
  const [data, setData] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchInitialData();
  }, [selectedFilter, dateRange]);

  const fetchInitialData = async () => {
    setIsLoading(true);

    try {
      let query = firestore()
        .collection('users')
        .doc(user.uid)
        .collection('records')
        .orderBy('createdAt', 'desc')
        .limit(ItemsPerPage);

      if (dateRange && dateRange.length === 2) {
        query = query
          .where('createdAt', '>=', dateRange[0])
          .where('createdAt', '<=', dateRange[1]);
      }

      if (selectedFilter) {
        query = query.where('categoryID', '==', selectedFilter.id);
      }

      const querySnapshot = await query.get();
      const records = querySnapshot.docs.map(doc => doc.data());
      setData(records);
      setCurrentAmount(records.length);

      // Get the total count for the initial query
      setTotalItems(querySnapshot.size);

      if (querySnapshot.docs.length > 0) {
        const lastVisibleDoc =
          querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastVisible(lastVisibleDoc);
      } else {
        setLastVisible(null);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  const fetchMoreData = async () => {
    setIsLoading(true);

    try {
      if (lastVisible) {
        let query = firestore()
          .collection('users')
          .doc(user.uid)
          .collection('records')
          .orderBy('createdAt', 'desc')
          .startAfter(lastVisible)
          .limit(ItemsPerPage);

        if (dateRange && dateRange.length === 2) {
          query = query
            .where('createdAt', '>=', dateRange[0])
            .where('createdAt', '<=', dateRange[1]);
        }

        if (selectedFilter) {
          query = query.where('categoryID', '==', selectedFilter.id);
        }

        const querySnapshot = await query.get();

        if (!querySnapshot.empty) {
          const newRecords = querySnapshot.docs.map(doc => doc.data());
          setData(prevData => [...prevData, ...newRecords]);

          const newLastVisible =
            querySnapshot.docs[querySnapshot.docs.length - 1];
          setLastVisible(newLastVisible);

          // Update the total count for the new set of data
          setTotalItems(prevTotal => prevTotal + querySnapshot.size);
        } else {
          setLastVisible(null);
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching more data:', error);
      setIsLoading(false);
    }
  };

  const navigation = useNavigation();

  const handleScrollEnd = ({nativeEvent}) => {
    const offsetY = nativeEvent.contentOffset.y;
    const contentHeight = nativeEvent.contentSize.height;
    const visibleHeight = nativeEvent.layoutMeasurement.height;

    if (offsetY + visibleHeight >= contentHeight) {
      fetchMoreData();
    }
  };

  return (
    <View flex={1}>
      <View w="100%" p={1}>
        <ScrollView onScrollEndDrag={handleScrollEnd}>
          <Text>{`<${currentAmount}/${totalItems}>`}</Text>
          {data.map((record, index) => (
            <HStack
              key={index}
              justifyContent="space-between"
              alignItems="center"
              w="100%">
              <Image
                source={
                  record.category.IconName
                    ? iconsList[record.category.IconName].Icon
                    : iconsList[2].Icon
                }
                style={{width: 50, height: 50}}
                alt={`Image ${index}`}
                key={`Image ${record.categoryID}`}
              />
              <Pressable
                onPress={() => {
                  navigation.navigate('RecordScreen', {record});
                }}
                flex="1"
                justifyContent="space-between"
                flexDirection="row"
                borderColor="orange.400"
                borderWidth="3"
                m="2"
                p="1">
                <Text fontSize="2xl">{`${record.shopName} `}</Text>
                <Text fontSize="2xl">{`:$${record.amount}`}</Text>
              </Pressable>
            </HStack>
          ))}
          {isLoading && (
            <View>
              <Spinner accessibilityLabel="Loading posts" color="orange.400" />
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default Bills;
