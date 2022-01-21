import React, { useState, ChangeEvent, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { useAppDispatch } from "@/hooks/useRedux";
import { login } from "src/session/redux";
import { checkVerification } from "./api";
import Verification from "./Verification";
import { sanitizePhoneNumber, validatePhoneNumber } from "./utils";


export type LoginInfo = {
  phoneNumber: string;
  name: string;
};

export default function LoginForm() {
  const dispatch = useAppDispatch();
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
