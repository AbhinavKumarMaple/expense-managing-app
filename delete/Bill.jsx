import React, {useState} from 'react';
import {
  View,
  HStack,
  Pressable,
  Text,
  IconButton,
  ScrollView,
} from 'native-base';
import {Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const data = [
  {
    Icon: require('../../assets/expense-management/icons/1.png'),
    BillName: 'Bill 1',
    BillTotal: '$100',
  },
  {
    Icon: require('../../assets/expense-management/icons/2.png'),
    BillName: 'Bill 2',
    BillTotal: '$150',
  },
  {
    Icon: require('../../assets/expense-management/icons/3.png'),
    BillName: 'Bill 3',
    BillTotal: '$200',
  },
  {
    Icon: require('../../assets/expense-management/icons/4.png'),
    BillName: 'Bill 4',
    BillTotal: '$80',
  },
  {
    Icon: require('../../assets/expense-management/icons/5.png'),
    BillName: 'Bill 5',
    BillTotal: '$120',
  },
  {
    Icon: require('../../assets/expense-management/icons/6.png'),
    BillName: 'Bill 6',
    BillTotal: '$90',
  },
];

const ItemsPerPage = 5;

const Bills = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const pageCount = Math.ceil(data.length / ItemsPerPage);

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const navigation = useNavigation();
  return (
    <View flex={1}>
      <View w="100%" p={1}>
        <ScrollView>
          {data
            .slice(currentPage * ItemsPerPage, (currentPage + 1) * ItemsPerPage)
            .map((bill, index) => (
              <HStack
                key={index}
                justifyContent="space-between"
                alignItems="center"
                w="100%">
                <Image
                  source={bill.Icon}
                  key={index}
                  style={{width: 50, height: 50}}
                  alt="1"
                />
                <Pressable
                  onPress={() => navigation.navigate('RecordScreen')}
                  flex="1"
                  justifyContent="space-between"
                  flexDirection="row"
                  borderColor="orange.400"
                  borderWidth="3"
                  m="2"
                  p="1">
                  <Text fontSize="2xl">{`${bill.BillName} `}</Text>
                  <Text fontSize="2xl">{` ${bill.BillTotal}`}</Text>
                </Pressable>
              </HStack>
            ))}
        </ScrollView>
      </View>
      <HStack justifyContent="flex-end" alignItems="center">
        <IconButton
          icon={<MaterialIcons name="arrow-back-ios" size={45} />}
          disabled={currentPage === 0}
          onPress={() => handlePageChange(currentPage - 1)}
        />
        <Text fontSize="xl">{`${currentPage * ItemsPerPage + 1} - ${
          (currentPage + 1) * ItemsPerPage
        } of ${data.length}`}</Text>
        <IconButton
          icon={<MaterialIcons name="arrow-forward-ios" size={45} />}
          disabled={currentPage === pageCount - 1}
          onPress={() => handlePageChange(currentPage + 1)}
        />
      </HStack>
    </View>
  );
};

export default Bills;
