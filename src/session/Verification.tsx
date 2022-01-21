import { FormEvent, useState } from "react";
import { HStack, PinInput, PinInputField, Stack, Text } from "@chakra-ui/react";
import { verify } from "./api";


const VERIFICATION_CODE_DIGITS = 6;
const MAX_NUM_ERRORS = 3;

type VerificationProps = {
  phoneNumber: string;
  onVerified: () => void;
};

export default function Verification({ phoneNumber, onVerified }: VerificationProps) {
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [numErrors, setNumErrors] = useState<number>(0);
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
      {numErrors <= MAX_NUM_ERRORS && (
        <form
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault(); // Needed to get rid of autocomplete suggestion on Chrome
          }}
        >
          <HStack>
            <PinInput
              size={'lg'}
              type={'number'}
              isDisabled={isVerifying}
              onComplete={handleVerifyCode}
              variant={'outline'}
            >
              {Array.from(Array(VERIFICATION_CODE_DIGITS)).map(() => (
                <PinInputField />
              ))}
            </PinInput>
          </HStack>
        </form>
      )}
      {numErrors > 0 && (
        <>
          <Text color={'red'}>
            The code you entered was incorrect.
          </Text>
          {numErrors > MAX_NUM_ERRORS && (
            <Text>
              Please try again later.
            </Text>
          )}
        </>
      )}
    </Stack>
  );
}