import { useRouter } from 'next/router';
import { Box } from '@chakra-ui/react';
import LoginForm from '@/components/login/LoginForm';
import { useAppSelector } from '@/hooks/useRedux';
import { selectToken } from 'features/session';


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
