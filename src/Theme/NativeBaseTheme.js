import {extendTheme} from 'native-base';

const theme = extendTheme({
  colors: {
    // Add new color
    primary: {
      50: '#FFA500',
    },
    // Redefining only one shade, rest of the color will remain same.
    orange: {
      400: '#FFA500',
    },
    gray: {
      1: '#F2F2F2',
    },
  },
  components: {
    Button: {
      // Define the outline variant for the Button component
      variants: {
        outline: {
          bg: 'transparent', // Transparent background
          borderColor: 'orange.400', // Border color
          borderWidth: 2, // Border width
          color: 'orange.400', // Text color
          _pressed: {
            bg: 'orange.400', // Background color on press
            borderColor: 'orange.400', // Border color on press
            borderWidth: 2, // Border width on press
            color: 'white', // Text color on press
          },
        },
      },
      defaultProps: {
        variant: 'outline', // Apply the outline variant by default
      },
    },
    Input: {
      // Modify the default style for the Input component
      baseStyle: {
        borderColor: 'orange.400', // Default border color
        borderWidth: 3, // Default border width
      },
      variants: {
        outline: {
          // Define the styles for the focused state
          field: {
            borderColor: 'orange.400', // Focused border color
            borderWidth: 3, // Focused border width
            _focus: {
              borderColor: 'orange.400', // Focused border color on focus
              borderWidth: 3, // Focused border width on focus
            },
          },
        },
      },
    },
    // Box: {
    //   baseStyle: {
    //     bgColor: 'gray.1', // Set your desired background color here
    //     // flexWrap: 'wrap',
    //   },
    // },
    Pressable: {
      baseStyle: {
        _pressed: {
          opacity: 0.7, // Change opacity when pressed
        },
      },
    },
  },
});

export default theme;
