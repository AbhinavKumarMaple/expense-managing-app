import {Box, Text, Toast} from 'native-base';

const showCustomToast = ({
  title = 'Default Title',
  duration = 1000,
  status = 'info',
  isClosable = true,
  bgColor = 'orange.400',
  textColor = 'white',
  id = 'ToastID',
  toast,
}) => {
  console.log(id);
  if (!toast.isActive(id)) {
    Toast.show({
      id,
      title,
      status,
      duration,
      isClosable,
      render: () => (
        <Box bg={bgColor} px="2" py="1" rounded="sm">
          <Text color={textColor}>{title}</Text>
        </Box>
      ),
    });
  }
};

export default showCustomToast;
