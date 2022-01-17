import { Input, Stack, Text } from "@chakra-ui/react";
import { ChangeEvent, FormEvent, useState } from "react";
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
      setCode("");
    }
  }

  return (
    <Stack spacing={4}>
      <Text>
        {`Please enter your ${VERIFICATION_CODE_DIGITS}-digit authentication code we sent to your phone.`}
      </Text>
      <form
        onSubmit={(e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
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
        />
      </form>
    </Stack>
  );
}