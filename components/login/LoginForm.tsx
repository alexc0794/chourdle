import { Box, Button, FormControl, Input, InputGroup, InputLeftAddon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack } from "@chakra-ui/react";
import React, { useState, ChangeEvent, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Redirect, useLocation } from "react-router-dom";
// import Form from "react-bootstrap/Form";
// import InputGroup from "react-bootstrap/InputGroup";
// import Button from "react-bootstrap/Button";
// import Spinner from "react-bootstrap/Spinner";
import { checkVerification } from "./api";
import Verification from "./Verification";
// import { login } from "../actions";
// import { selectPhoneNumber } from "../selectors";
// import "./index.css";


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


  // const isLoggedIn = !!useSelector(selectPhoneNumber);
  // if (isLoggedIn) {
  //   const params = new URLSearchParams(search);
  //   const redirectPath = params.get('redirect');
  //   if (redirectPath) {
  //     return <Redirect to={redirectPath} />
  //   }
  // }

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
    // dispatch(login(loginInfo));
    setIsLoading(false);
  }

  return (
    <Stack spacing={4}>
      <InputGroup size="lg">
        <InputLeftAddon children='Name' color='black' bgColor='gray.300' />
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
        <InputLeftAddon children='Phone' color='black' bgColor='gray.300' />
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