import React, { useState, ChangeEvent } from "react";
import { Event } from "@/interfaces";
import { inviteGuests } from "src/event/redux";
import { sanitizePhoneNumber, validatePhoneNumber } from "src/session/utils";
import { Button, Flex, Input, InputGroup, InputLeftAddon, InputRightAddon } from "@chakra-ui/react";
import { useAppDispatch } from "@/hooks/useRedux";


type InviteUserProps = {
  event: Event;
};

export default function InviteUser({ event }: InviteUserProps) {
  const dispatch = useAppDispatch();
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const handleUpdatePhoneNumber = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setPhoneNumber(sanitizePhoneNumber(input));
  }

  const handleInvite = () => {
    if (validatePhoneNumber(phoneNumber)) {
      dispatch(inviteGuests({
        eventId: event.eventId,
        phoneNumbers: [phoneNumber]
      }));
      // Reset phone number to empty
      setPhoneNumber('');
    }
  };

  return (
    <Flex m={'1rem'}>
      <InputGroup size={'lg'}>
        <InputLeftAddon children={'+1'} color={'black'} />
        <Input
          type={'tel'}
          placeholder={'Phone number'}
          aria-label={'Phone number'}
          aria-describedby={'Phone number'}
          value={phoneNumber}
          onChange={handleUpdatePhoneNumber}
          bg={'white'}
          color={'black'}
        />
        <InputRightAddon p={1}>
          <Button
            size={'md'}
            onClick={handleInvite}
            disabled={!validatePhoneNumber(phoneNumber)}
            colorScheme={'blue'}
          >
            Invite
          </Button>
        </InputRightAddon>

      </InputGroup>
    </Flex>
  );
}
