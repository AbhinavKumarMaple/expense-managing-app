import {Platform, Text, View} from 'react-native';

const PlatformName = () => {
  return (
    <View>
      <Text>{Platform.OS}</Text>
    </View>
  );
};

export default PlatformName;
