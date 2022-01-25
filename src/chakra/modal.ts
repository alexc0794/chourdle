import { ComponentStyleConfig } from "@chakra-ui/react"


const Modal: ComponentStyleConfig = {
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
};

export default Modal;
