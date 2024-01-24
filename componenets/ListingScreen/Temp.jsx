import React, {useState} from 'react';
import {Box, Button, HStack, Pressable, Text, VStack} from 'native-base';
import {View} from 'react-native';
import DatePickerComp from './DatePickerComp';

const Temp = () => {
  const [open, setOpen] = useState(false);
  const [firstDate, setFirstDate] = useState(null);
  const [secondDate, setSecondDate] = useState(null);

  const handleDateChange = date => {
    if (open === 'first') {
      setFirstDate(date);
    } else if (open === 'second') {
      setSecondDate(date);
    }
    setOpen(false);
  };

  return (
    <View>
      <HStack justifyContent={'space-between'} w="100%" alignItems="center">
        <DatePickerComp
          date={firstDate}
          isOpen={open === 'first'}
          onDateChange={handleDateChange}
          onClose={() => setOpen(false)}
        />
        <Pressable onPress={() => setOpen('first')}>
          <Box borderColor={'orange.400'} borderWidth="2" p="2">
            <Text fontSize="2xl">
              {firstDate ? firstDate.toISOString().split('T')[0] : ''}
            </Text>
          </Box>
        </Pressable>
        <VStack justifyContent="space-between" alignItem="center">
          <Text color="orange.400" fontSize="5xl" alignSelf="center">
            :
          </Text>
        </VStack>
        <DatePickerComp
          date={secondDate}
          isOpen={open === 'second'}
          onDateChange={handleDateChange}
          onClose={() => setOpen(false)}
        />
        <Pressable onPress={() => setOpen('second')}>
          <Box borderColor={'orange.400'} borderWidth="2" p="2">
            <Text fontSize="2xl">
              {secondDate ? secondDate.toISOString().split('T')[0] : ''}
            </Text>
          </Box>
        </Pressable>
      </HStack>
    </View>
  );
};

export default Temp;
