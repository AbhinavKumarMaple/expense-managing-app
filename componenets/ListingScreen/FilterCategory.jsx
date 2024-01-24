import {Box, HStack, Pressable, Text} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Image} from 'react-native';
import {FilterIcons, iconsList} from '../../src/utils/IconsList.js';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';

const FilterCategory = ({updateFilter}) => {
  const [mostUsedIcons, setMostUsedIcons] = useState([]);

  // get current user
  const user = firebase.auth().currentUser;

  useEffect(() => {
    fetchMostUsedIcons();
  }, []);
  const fetchMostUsedIcons = async () => {
    try {
      const categoriesCountDoc = await firestore()
        .collection('users')
        .doc(user.uid)
        .collection('categoryCounts')
        .doc('categories')
        .get();

      if (categoriesCountDoc.exists) {
        const categoriesCountData = categoriesCountDoc.data();

        if (categoriesCountData) {
          const iconNameCounts = categoriesCountData;

          const iconNameCountArray = Object.keys(iconNameCounts).map(
            iconId => ({
              id: iconId, // Add the id of the category object
              iconName: iconNameCounts[iconId].name,
              count: iconNameCounts[iconId].count,
              iconIndex: iconNameCounts[iconId].icon, // Store the icon index
            }),
          );

          iconNameCountArray.sort((a, b) => b.count - a.count);

          const top5Icons = iconNameCountArray.slice(0, 5);
          console.log(top5Icons);

          // If there are fewer than 5 categories, add default values
          while (top5Icons.length < 5) {
            top5Icons.push({
              id: 'default', // You may want to provide a meaningful default id
              iconName: iconsList[top5Icons.length].name,
              count: 0,
              iconIndex: 2, // Use the index as the icon index
            });
          }

          setMostUsedIcons(top5Icons);
        }
      }
    } catch (error) {
      console.error('Error fetching most used icons:', error);
    }
  };

  //Clear updateFilter
  const handleReset = () => {
    // Call updateFilter with a new object having only the id property cleared
    updateFilter(null);
  };
  return (
    <Box w="100%">
      <HStack justifyContent="space-between">
        <Pressable
          key={'reset'}
          onPress={() => {
            console.log('reset');
            handleReset();
          }}>
          <Image source={FilterIcons[0].Icon} style={{width: 55, height: 55}} />
        </Pressable>
        {mostUsedIcons.map((category, index) => (
          <Pressable key={index} onPress={() => updateFilter(category)}>
            {console.log(category)}
            <Image
              source={iconsList[category.iconIndex].Icon}
              style={{width: 55, height: 55}}
            />
          </Pressable>
        ))}
      </HStack>
    </Box>
  );
};

export default FilterCategory;
