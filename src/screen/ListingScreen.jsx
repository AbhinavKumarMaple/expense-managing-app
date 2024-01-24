import React, {useEffect, useState} from 'react';

import DateSelect from '../../componenets/ListingScreen/DateSelect';
import Bills from '../../componenets/ListingScreen/Bills';

import DateRange from '../../componenets/ListingScreen/DateRange';
import FilterCategory from '../../componenets/ListingScreen/FilterCategory';
import TabNavigation from '../../componenets/ListingScreen/TabNavigation';
import withAuthenticationValidation from '../utils/withAuthenticationValidation';
import {Box} from 'native-base';
import {useImageContext} from '../../componenets/ImageContext';
import InterstitialAdComponent from '../../componenets/InterstitialAdComponent';

const ListingScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState(null);
  // state for storing day
  const [selectedDayRange, setSelectedDayRange] = useState(null);
  //state for sotring date range from date range
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);

  const updateFilter = filter => {
    console.log('this filter', filter);
    setSelectedFilter(filter);
  };
  //useeffect for logging
  // useEffect(() => {
  //   console.log('selected filter', selectedFilter);
  //   console.log('selected date range', dateRange);
  // }, [selectedFilter, dateRange]);
  const {count, setCount} = useImageContext();

  return (
    <>
      {count > 2 ? <InterstitialAdComponent /> : null}

      <Box
        flex={1}
        // justifyContent="space-between"
        alignItems="center"
        w={'100%'}
        maxHeight={'95%'}
        px="2">
        <DateSelect setValue={setSelectedDayRange} value={selectedDayRange} />
        <Box justifyContent="" alignItems="center" w={'100%'} px="2">
          <DateRange
            setDayRange={setSelectedDayRange}
            dayRange={selectedDayRange}
            setDateRange={setDateRange}
          />

          <FilterCategory updateFilter={updateFilter} />
          <Box
            style={{
              height: '65%',
              margin: 10,
              width: '100%',
            }}>
            <Bills selectedFilter={selectedFilter} dateRange={dateRange} />
          </Box>
        </Box>
        <TabNavigation />
      </Box>
    </>
  );
};

export default withAuthenticationValidation(ListingScreen);
