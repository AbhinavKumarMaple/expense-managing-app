import React, {useState, useEffect} from 'react';
import {Box, Center, HStack, Pressable, Text, VStack} from 'native-base';
import DatePickerComp from './DatePickerComp';

const DateRange = ({setDayRange, dayRange, setDateRange}) => {
  const [open, setOpen] = useState(false);
  const [firstDate, setFirstDate] = useState(new Date());
  const [secondDate, setSecondDate] = useState(new Date()); // Set default date
  //state for the datePickerComp mode, 0=day, 1=week,2=month, 3=year
  const [datePickerMode, setDatePickerMode] = useState(0);

  // const handlePress = () => {
  //   setOpen(true);
  // }
  useEffect(() => {
    console.log(firstDate, secondDate);
    setDateRange([firstDate, secondDate]);
  }, [firstDate, secondDate]);

  useEffect(() => {
    const currentDate = new Date();
    const OneDayAgo = new Date();
    OneDayAgo.setDate(currentDate.getDate() - 1);
    setFirstDate(OneDayAgo);
    setSecondDate(new Date());
  }, []);

  //change the datePickerComp mode based on dayRange, 0=day, 1=week,2=month, 3=year
  useEffect(() => {
    if (dayRange === 0) {
      const currentDate = new Date();
      const OneDayAgo = new Date();
      OneDayAgo.setDate(currentDate.getDate() - 1);
      setFirstDate(OneDayAgo);
      setSecondDate(new Date());
      setDatePickerMode(0);
    } else if (dayRange === 1) {
      const currentDate = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(currentDate.getDate() - 7);
      setFirstDate(sevenDaysAgo);
      setSecondDate(new Date());
      setDatePickerMode(1);
    } else if (dayRange === 2) {
      const currentDate = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(currentDate.getMonth() - 1);
      setFirstDate(oneMonthAgo);
      setSecondDate(new Date());
      setDatePickerMode(2);
    } else if (dayRange === 3) {
      const currentDate = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(currentDate.getFullYear() - 1);
      setFirstDate(oneYearAgo);
      setSecondDate(new Date());
      setDatePickerMode(3);
    }
    setOpen(false);
  }, [dayRange]);

  const handleDateChange = date => {
    if (open === 'first') {
      setFirstDate(date);
      setDayRange(null);
    } else if (open === 'second') {
      setSecondDate(date);
      setDayRange(null);
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
        mode={datePickerMode}
      />
      <DatePickerComp
        date={secondDate}
        isOpen={open === 'second'}
        onDateChange={handleDateChange}
        onClose={() => setOpen(false)}
        mode={datePickerMode}
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
