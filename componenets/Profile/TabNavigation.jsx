import {
  Box,
  Button,
  Center,
  Container,
  HStack,
  Image,
  Pressable,
} from 'native-base';
import Home from '../../assets/Record_Screen-Back_button.icon.png';
import {useNavigation} from '@react-navigation/native';
import {useImageContext} from '../ImageContext';

const TabNavigation = () => {
  const {count, setCount} = useImageContext();

  const navigation = useNavigation();
  return (
    <Center w="100%" py={3} px={2}>
      <HStack
        p={1}
        justifyContent="space-between"
        width={'100%'}
        alignItem="center">
        <Pressable
          variant="ghost"
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
              setCount(count + 1);
            } else {
              navigation.navigate('HomeScreen'); // Replace 'HomeScreen' with the actual name of your HomeScreen
              setCount(count + 1);
            }
          }}>
          <Image shadow={2} source={Home} size="50" alt={'2'} />
        </Pressable>
      </HStack>
    </Center>
  );
};

export default TabNavigation;
