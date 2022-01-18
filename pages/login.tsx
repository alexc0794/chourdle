import { useRouter } from 'next/router';
import { Box } from '@chakra-ui/react';
import { useAppSelector } from '@/hooks/useRedux';
import { selectToken } from 'src/session/redux';
import LoginForm from 'src/session/LoginForm';


export default function Login() {
  const router = useRouter();
  const isLoggedIn = !!useAppSelector(selectToken);
  if (isLoggedIn) {
    const redirectPath = router.query['redirect']
    if (redirectPath && typeof redirectPath === "string") {
      router.push(redirectPath);
    } else {
      router.push('/');
    }
  }

  return (
    <Box position='fixed' bottom='10%' width='100%' padding='1rem'>
      <LoginForm />
    </Box>
  );
}
