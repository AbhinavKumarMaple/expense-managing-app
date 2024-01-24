import React from 'react';
import {Image} from 'react-native';

const Icon = ({iconName, size = 30}) => {
  const iconPath = `../../assets/icons/${iconName}.png`;

  return (
    <Image source={require(iconPath)} style={{width: size, height: size}} />
  );
};

export default Icon;
