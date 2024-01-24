import React, {useState, useEffect} from 'react';
import {Image} from 'react-native';
import {View, HStack, Pressable, Center, Text, VStack} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {icons} from '../../componenets/ListingScreen/Icons';
// import {convertRemToAbsolute} from 'native-base/lib/typescript/theme/tools';
// import DatePickerComp from './DatePickerComp';

const DateSelect = ({setValue, value}) => {
  useEffect(() => {
    console.log(value);
  }, [handleIconPress, handleNavigation]);
  // const [selectedIconIndex, setValue] = useState(null);

  const handleIconPress = index => {
    setValue(index);
  };

  const handleNavigation = direction => {
    if (direction === 'left') {
      setValue(prevIndex => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    } else if (direction === 'right') {
      setValue(prevIndex => (prevIndex < 3 ? prevIndex + 1 : prevIndex));
    }
  };

  return (
    <View justifyContent="center" alignItems="center" w={'100%'} p="2">
      <VStack alignItems={'center'}>
        <HStack justifyContent="space-between" alignItems="center">
          <Pressable onPress={() => handleNavigation('left')}>
            <MaterialIcons name="arrow-back-ios" size={45} color="gray" />
          </Pressable>
          {icons.map((icon, index) => (
            <Pressable key={index} onPress={() => handleIconPress(index)}>
              <Image
                source={value === index ? icon.selected : icon.unselected}
                style={{width: 65, height: 65}}
              />
            </Pressable>
          ))}
          <Pressable onPress={() => handleNavigation('right')}>
            <MaterialIcons name="arrow-forward-ios" size={45} color="gray" />
          </Pressable>
        </HStack>
      </VStack>
    </View>
  );
};

export default DateSelect;
