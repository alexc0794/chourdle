import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Event, User } from "@/interfaces";
import { Button, Center, Drawer, DrawerContent, DrawerOverlay, Spinner, Text } from "@chakra-ui/react";
import InviteSuggestions from "./InviteSuggestions";
import { inviteGuests } from "src/event/redux";
import InviteUser from "./InviteUser";


type InviteActionProps = {
  event: Event;
  onClose: () => void;
};

export default function InviteAction({ event, onClose }: InviteActionProps) {
  const dispatch = useDispatch();
  const [selectedPhoneNumbers, setSelectedPhoneNumbers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  function handleSelectSuggestion(user: User): void {
    if (selectedPhoneNumbers.includes(user.phoneNumber)) {
      // Deselecting phone number
      setSelectedPhoneNumbers([...selectedPhoneNumbers.filter(phoneNumber => phoneNumber !== user.phoneNumber)]);
    } else {
      setSelectedPhoneNumbers([...selectedPhoneNumbers, user.phoneNumber]);
    }
  }

  async function handleInvite(): Promise<void> {
    setLoading(true);
    await dispatch(inviteGuests({
      eventId: event.eventId,
      phoneNumbers: selectedPhoneNumbers
    }));
    setSelectedPhoneNumbers([]);
    setLoading(false);
    onClose();
  }

  return (
    <Drawer
      isOpen
      onClose={onClose}
      placement="bottom"
    >
      <DrawerOverlay />
      <DrawerContent bgColor='background.gray' height='50vh'>
        <InviteUser event={event} />
        <InviteSuggestions
          event={event}
          selectedPhoneNumbers={selectedPhoneNumbers}
          onSelect={handleSelectSuggestion}
        />
        <Center p={'1rem'}>
          <Button
            size="lg"
            disabled={selectedPhoneNumbers.length === 0 || loading}
            onClick={handleInvite}
            colorScheme={'blue'}
          >
            {loading ? <Spinner animation="border" /> : (
              <Text>
                {`Invite ${selectedPhoneNumbers.length ? selectedPhoneNumbers.length : ""}`}
              </Text>
            )}
          </Button>
        </Center>
      </DrawerContent>
    </Drawer>
  );
}
