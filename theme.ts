import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    background: {
      dark: '#282c34',
    },
  },
  components: {},
  styles: {
    global: {
      body: {
        padding: 0,
        margin: 0,
        // fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
        //   "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
        color: 'white',
        background: 'linear-gradient(black, #1b2735 0%, #090a0f 100%)',
        backgroundAttachment: 'fixed',
        backgroundColor: 'black',
      },
      // 'html, body': {
      //   color: 'gray.600',
      //   lineHeight: 'tall',
      // },
      a: {
        color: 'teal.500',
      },
    },
  }
});

export default theme;