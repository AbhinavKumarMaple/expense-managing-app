import {
  Box,
  Button,
  Center,
  Container,
  HStack,
  Image,
  Pressable,
} from 'native-base';
import Back from '../../assets/Record_Screen-Back_button.icon.png';
import Done from '../../assets/Record_Screen_greentick.icon.png';
import Delete from '../../assets/Record_Screen_Trashbin.icon.png';
import {useNavigation} from '@react-navigation/native';

const Tab = ({HandleSubmit, Cancel}) => {
  const navigation = useNavigation();

  //clear Image context
  // setNewScannedImages
  const consoleText = () => {
    console.log('text');
  };

  return (
    <Center>
      <HStack
        // p={4}
        justifyContent="space-between"
        itemAlign="center"
        width={'100%'}>
        <Button
          variant="ghost"
          onPress={() => {
            navigation.goBack();
            Cancel();
          }}>
          <Image shadow={2} source={Back} alt="profile image" size="45" />
        </Button>
        <Button variant="ghost" onPress={() => Cancel()}>
          <Image shadow={2} source={Delete} alt="profile image" size="45" />
        </Button>
        <Button
          variant="ghost"
          onPress={() => {
            HandleSubmit();
          }}>
          <Image shadow={2} source={Done} alt="profile image" size="45" />
        </Button>
      </HStack>
    </Center>
  );
};

export default Tab;
