import { ChangeEvent, FormEvent, useState } from "react";
import { Center, Input, Spinner, Stack, Text } from "@chakra-ui/react";
import { verify } from "./api";


const VERIFICATION_CODE_DIGITS = 6;

type VerificationProps = {
  phoneNumber: string;
  onVerified: () => void;
};

export default function Verification({ phoneNumber, onVerified }: VerificationProps) {
  const [code, setCode] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [numErrors, setNumErrors] = useState<number>(0);

  function handleChangeCode(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    if (value.toString().length > VERIFICATION_CODE_DIGITS) {
      return;
    }
    if (value !== '' && !value.match(/^[0-9]+$/)) {
      return;
    }

    setCode(value)
    if (value.length >= VERIFICATION_CODE_DIGITS) {
      handleVerifyCode(value)
    }
  }

  async function handleVerifyCode(verifiedCode: string) {
    setIsVerifying(true);
    const verified = await verify(phoneNumber, verifiedCode);
    setIsVerifying(false);
    if (verified) {
      onVerified();
    } else {
      setNumErrors(numErrors + 1);
    }
  }

  return (
    <Stack spacing={4}>
      <Text>
        {`Please enter your ${VERIFICATION_CODE_DIGITS}-digit authentication code we sent to your phone.`}
      </Text>
      {isVerifying && (
        <Center><Spinner /></Center>
      )}
      <form
        onSubmit={(e: FormEvent<HTMLFormElement>) => {
          e.preventDefault(); // Need this to prevent autocomplete
        }}
      >
        <Input
          size="lg"
          type='number'
          autoComplete='off'
          maxLength={VERIFICATION_CODE_DIGITS}
          minLength={VERIFICATION_CODE_DIGITS}
          placeholder="XXX-XXX"
          onChange={handleChangeCode}
          value={code}
        />
      </form>
    </Stack>
  );
}