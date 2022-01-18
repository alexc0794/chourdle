import { MouseEvent, ChangeEvent, useState } from "react";
import { TRANSPORT_MODE_TO_DIRECTIONS_MODE } from "src/constants";
import { Event, EventUser } from "@/interfaces";
import { useAppDispatch } from "@/hooks/useRedux";
import { updateEventName } from "./redux";
import { Box, Button, Flex, Heading, Input, InputGroup, InputRightElement, Text } from "@chakra-ui/react";


type EventHeaderProps = {
  event: Event;
  me: EventUser | null;
  isEditable: boolean;
};

function EventHeader({ event, me, isEditable }: EventHeaderProps) {
  const dispatch = useAppDispatch();
  const headerText = event.eventName || event.place.mainText || '';

  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const handleNameClick = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (isEditable) {
      setIsEditingName(true);
    }
  };

  const [editedName, setEditedName] = useState<string>(headerText);
  const handleEditedNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const handleAddressClick = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const params = new URLSearchParams({
      daddr: event.place.mainText || `${event.place.position.latitude},${event.place.position.longitude}`,
      ...(me && me.transportMode !== null && me.transportMode in TRANSPORT_MODE_TO_DIRECTIONS_MODE ? {
        directionsmode: TRANSPORT_MODE_TO_DIRECTIONS_MODE[me.transportMode]
      } : {}),
    });
    window.location.href = `comgooglemaps://?${params.toString()}`
  };

  const handleSaveName = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      await dispatch(updateEventName({
        eventId: event.eventId,
        name: editedName
      }));
      setIsEditingName(false);
    } catch { }
  };

  return (
    <Flex
      direction='column'
      align='stretch'
      justify='center'
      p='1rem'
      m='0 0 1rem'
    >
      {isEditingName ? (
        <InputGroup>
          <Input
            value={editedName}
            onChange={handleEditedNameChange}
            fontSize='20pt'
            p='0 0.25rem'
          />
          <InputRightElement>
            <Button onClick={handleSaveName}>
              Save
            </Button>
          </InputRightElement>
        </InputGroup>
      ) : (
        <Heading
          onClick={handleNameClick}
          role="link"
          tabIndex={0}
          aria-label="Edit event name"
          mb='0.5rem'
          padding='0'
          fontSize='20pt'
        >
          {headerText}
        </Heading>
      )}
      <Box
        onClick={handleAddressClick}
        role="link"
        tabIndex={0}
        aria-label="Link to Google Maps"
      >
        {event.eventName === event.place.mainText ? (
          <Text fontSize='12pt' mb='0.1rem'>{'@'}{event.place.secondaryText || ''}</Text>
        ) : (
          <>
            {event.place.mainText && <Text fontSize='12pt' mb='0.1rem'>{'@'}{event.place.mainText}</Text>}
            {event.place.secondaryText && <Text fontSize='12pt' mb='0.1rem'>{event.place.secondaryText}</Text>}
          </>
        )}
      </Box>
    </Flex>
  );
}

export default EventHeader;
