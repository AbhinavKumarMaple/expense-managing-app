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

const TabNavigation = () => {
  const navigation = useNavigation();
  return (
    <Center w="100%">
      <HStack
        p={1}
        justifyContent="space-between"
        width={'100%'}
        alignItem="center">
        <Button
          variant="ghost"
          onPress={() => navigation.navigate('HomeScreen')}>
          <Image shadow={2} source={Home} size="50" alt={'2'} />
        </Button>
      </HStack>
    </Center>
  );
};

export default TabNavigation;
