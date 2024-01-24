import {
  Box,
  Button,
  Center,
  Container,
  HStack,
  Image,
  Pressable,
} from 'native-base';
import Share from '../../assets/ListingScreenSharebutton.icon.png';
import Home from '../../assets/ListingScreenHomebutton.icon.png';
import Download from '../../assets/ListingScreen-Downloadbutton.icon.png';
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
        <Button variant="ghost">
          <Image shadow={2} source={Share} size="50" alt={'3'} />
        </Button>
        <Button
          variant="ghost"
          onPress={() => navigation.navigate('HomeScreen')}>
          <Image shadow={2} source={Home} size="50" alt={'2'} />
        </Button>
        <Button variant="ghost">
          <Image shadow={2} source={Download} size="50" alt={'1'} />
        </Button>
      </HStack>
    </Center>
  );
};

export default TabNavigation;
