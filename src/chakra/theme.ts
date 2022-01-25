import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react';
import Button from './button';
import Heading from './heading';
import Modal from './modal';


const theme = extendTheme(
  {
    colors: {
      background: {
        dark: '#282c34',
        gray: '#343a40',
      },
      font: {
        lightgray: 'lightgray',
      }
    },
    components: {
      Button,
      Heading,
      Modal,
    },
    styles: {
      global: {
        body: {
          padding: 0,
          margin: '0 0 5rem 0',
          // fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
          //   "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
          color: 'white',
          background: 'linear-gradient(black, #1b2735 0%, #090a0f 100%)',
          backgroundAttachment: 'fixed',
          backgroundColor: 'black',
        },
        a: {
          color: 'teal.500',
        },
      },
    }
  },
  withDefaultColorScheme({
    colorScheme: 'blue',
    components: ['Button']
  })
);

export default theme;