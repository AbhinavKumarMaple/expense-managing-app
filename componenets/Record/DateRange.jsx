import React, {useState, useEffect} from 'react';
import {Box, Center, HStack, Pressable, Text, VStack} from 'native-base';
// import DatePickerComp from './DatePickerComp';
import DatePicker from 'react-native-date-picker';

const DateRange = () => {
  const [open, setOpen] = useState(false);
  const [firstDate, setFirstDate] = useState(null);
  const [secondDate, setSecondDate] = useState(new Date()); // Set default date

  useEffect(() => {
    const currentDate = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(currentDate.getDate() - 7);
    setFirstDate(sevenDaysAgo);
  }, []);

  const handleDateChange = date => {
    if (open === 'first') {
      setFirstDate(date);
    } else if (open === 'second') {
      setSecondDate(date);
    }
    setOpen(false);
  };

  return (
    <Center alignItems="center">
      <DatePickerComp
        date={firstDate}
        isOpen={open === 'first'}
        onDateChange={handleDateChange}
        onClose={() => setOpen(false)}
      />
      <DatePickerComp
        date={secondDate}
        isOpen={open === 'second'}
        onDateChange={handleDateChange}
        onClose={() => setOpen(false)}
      />
      <HStack justifyContent={'space-around'} w="100%" alignItems="center">
        <Pressable
          onPress={() => setOpen('first')}
          alignItems="center"
          justifyContent={'center'}>
          <Box borderColor={'orange.400'} borderWidth="2" p="2">
            <Text fontSize="2xl">
              {firstDate ? firstDate.toISOString().split('T')[0] : ''}
            </Text>
          </Box>
        </Pressable>
        <VStack justifyContent="space-between" alignItems="center">
          <Text color="orange.400" fontSize="5xl">
            :
          </Text>
        </VStack>
        <Pressable onPress={() => setOpen('second')}>
          <Box borderColor={'orange.400'} borderWidth="2" p="2">
            <Text fontSize="2xl">
              {secondDate ? secondDate.toISOString().split('T')[0] : ''}
            </Text>
          </Box>
        </Pressable>
      </HStack>
    </Center>
  );
};

export default DateRange;
