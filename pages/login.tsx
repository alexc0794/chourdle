import { useRouter } from 'next/router';
import { Box, Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/react';
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
      router.push('/home');
    }
  }

  return (
    <Modal isOpen isCentered onClose={() => { }}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <LoginForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  )

}
