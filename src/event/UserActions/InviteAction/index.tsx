import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Event, User } from "@/interfaces";
import { Button, Center, Drawer, DrawerContent, DrawerOverlay, Spinner, Text } from "@chakra-ui/react";
import { SmallAddIcon } from "@chakra-ui/icons";
import InviteSuggestions from "./InviteSuggestions";
import { inviteGuests } from "src/event/redux";
import InviteUser from "./InviteUser";


type InviteActionProps = {
  event: Event;
};

export default function InviteAction({ event }: InviteActionProps) {
  const dispatch = useDispatch();
  const [show, setShow] = useState<boolean>(false);
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
    setShow(false);
  }

  return (
    <>
      <Button
        className="EventPageInvite"
        variant="link"
        onClick={() => setShow(true)}
        disabled={loading}
        leftIcon={<SmallAddIcon />}
      >
        Guests
      </Button>
      <Drawer
        isOpen={show}
        onClose={() => setShow(false)}
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
    </>
  );
}
