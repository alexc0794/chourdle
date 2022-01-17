import { Box } from '@chakra-ui/react';
import LoginForm from '../components/login/LoginForm';


export default function Login() {
  return (
    <Box position='fixed' bottom='10%' width='100%' padding='1rem'>
      <LoginForm />
    </Box>
  );
}
