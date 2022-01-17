import React, { useState, ChangeEvent, useEffect } from "react";
import { Box, Button, Input, InputGroup, InputLeftAddon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack } from "@chakra-ui/react";
import { useRouter } from 'next/router';
import { login, selectToken } from "../../features/session";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { checkVerification } from "./api";
import Verification from "./Verification";


export type LoginInfo = {
  phoneNumber: string;
  name: string;
};

export default function LoginForm() {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [showVerification, setShowVerification] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isLoginValid = !!name && validatePhoneNumber(phoneNumber);

  useEffect(() => {
    const localStorageLoginInfo = window.localStorage.getItem("login");
    const initialLoginInfo: LoginInfo | null = localStorageLoginInfo
      ? JSON.parse(localStorageLoginInfo)
      : null;
    if (initialLoginInfo) {
      setPhoneNumber(initialLoginInfo.phoneNumber);
      setName(initialLoginInfo.name);
    }
  }, []);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLoggedIn = !!useAppSelector(selectToken);
  if (isLoggedIn) {
    const redirectPath = router.query['redirect']
    if (redirectPath && typeof redirectPath === "string") {
      router.push(redirectPath);
    } else {
      router.push('/');
    }
  }

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    let re = /^[a-zA-Z]+$/;
    const input = event.target.value;
    if (input === "" || (re.test(input) && input.length <= 20)) {
      setName(input);
    }
  }

  const handleChangePhoneNumber = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setPhoneNumber(sanitizePhoneNumber(input))
  }

  const handleCloseModal = () => {
    setShowVerification(false);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const requiresVerification = await checkVerification(phoneNumber)
      if (requiresVerification) {
        setShowVerification(true);
      } else {
        handleLogin();
      }
    } catch (e) {
      setIsLoading(false);
    }
  }

  const handleLogin = async () => {
    setShowVerification(false);
    const loginInfo: LoginInfo = { phoneNumber, name };
    window.localStorage.setItem("login", JSON.stringify(loginInfo));
    dispatch(login({
      phoneNumber,
      name,
    }));
    setIsLoading(false);
  }

  return (
    <Stack spacing={4}>
      <InputGroup size="lg">
        <InputLeftAddon color='black' bgColor='gray.300'>Name</InputLeftAddon>
        <Input
          variant="outline"
          size='lg'
          type='text'
          onChange={handleChangeName}
          value={name}
          bgColor='white'
          color='black'
        />
      </InputGroup>
      <InputGroup size="lg">
        <InputLeftAddon color='black' bgColor='gray.300'>Phone</InputLeftAddon>
        <Input
          type='tel'
          onChange={handleChangePhoneNumber}
          value={phoneNumber}
          bgColor='white'
          color='black'
        />
      </InputGroup>
      <Box display='flex' justifyContent='center'>
        <Button
          size="lg"
          disabled={!isLoginValid}
          isLoading={isLoading}
          onClick={handleSubmit}
          colorScheme='blue'
        >
          Sign in
        </Button>
      </Box>
      <Modal
        variant="light"
        isOpen={showVerification}
        onClose={handleCloseModal}
        isCentered
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>SMS Verification 📲</ModalHeader>
          <ModalBody>
            <Verification
              phoneNumber={phoneNumber}
              onVerified={handleLogin}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Stack>
  );
}


function validatePhoneNumber(phoneNumber: string): boolean {
  let re = /^(0|[1-9][0-9]*)$/;
  if (phoneNumber.length !== 10 || !re.test(phoneNumber)) {
    return false;
  }
  return true;
}


function sanitizePhoneNumber(phoneNumber: string): string {
  const PHONE_NUMBER_LENGTH = 10;
  const numericPhoneNumber = phoneNumber.replace(/\D/g, '');
  if (numericPhoneNumber.length > PHONE_NUMBER_LENGTH) {
    return numericPhoneNumber.substring(numericPhoneNumber.length - PHONE_NUMBER_LENGTH);
  }
  return numericPhoneNumber;
}