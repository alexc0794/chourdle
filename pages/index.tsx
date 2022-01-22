import { useAppSelector } from "@/hooks/useRedux";
import { Box, Button, Center, Modal, ModalBody, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { shimmer } from "src/chakra/animation";
import LoginForm from "src/session/LoginForm";
import { selectToken } from "src/session/redux";
import Features from "src/welcome/Features";
import Footer from "src/welcome/Footer";
import Hero from "src/welcome/Hero";


export default function Welcome() {
  const isLoggedIn = !!useAppSelector(selectToken);
  const { push } = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleLogin = () => push('/home');
  const handleClick = () => {
    if (isLoggedIn) {
      push('/home');
    } else {
      setIsOpen(true);
    }
  }

  return (
    <Box>
      <Hero />
      <>
        <Center p={'1rem'}>
          <Button
            size={'lg'}
            onClick={handleClick}
            bg={'linear-gradient(45deg, #d422b1, #ffce00)'}
            animation={`${shimmer} 5s ease infinite`}
            bgSize={'200% 200%'}
            variant={'none'}
          >
            Get Started
          </Button>
        </Center>
        <Modal
          isOpen={isOpen}
          isCentered
          onClose={() => setIsOpen(false)}
          variant={'light'}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalBody>
              <LoginForm onLogin={handleLogin} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
      <Features />
      <Footer />
    </Box>
  );
}
