import { extendTheme } from '@chakra-ui/react'


const theme = extendTheme({
  colors: {
    background: {
      dark: '#282c34',
    },
  },
  components: {
    Button: {
    },
    Modal: {
      parts: ['content'],
      variants: {
        light: {
          dialog: {
            color: 'black',
            bg: 'white',
          },
          header: {
            fontSize: '16pt',
            borderBottom: '1px solid',
            borderBottomColor: 'gray.300'
          },
          body: {
            p: '1.5rem',
          }
        }
      }
    }
  },
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
      a: {
        color: 'teal.500',
      },
    },
  }
});

export default theme;