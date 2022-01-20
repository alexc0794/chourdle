import { MouseEvent, useState } from "react";
import { TRANSPORT_MODE_TO_DIRECTIONS_MODE } from "src/constants";
import { Event, EventUser } from "@/interfaces";
import { useAppDispatch } from "@/hooks/useRedux";
import { updateEventName } from "./redux";
import { Box, Editable, EditableInput, EditablePreview, Flex, Heading, IconButton, InputGroup, InputRightElement, Text, useEditableControls } from "@chakra-ui/react";
import { ChevronRightIcon } from '@chakra-ui/icons'


type EventHeaderProps = {
  event: Event;
  me: EventUser | null;
  isEditable: boolean;
};

export default function EventHeader({ event, me, isEditable }: EventHeaderProps) {
  const dispatch = useAppDispatch();
  const headerText = event.eventName || event.place.mainText || '';

  const [editedName, setEditedName] = useState<string>(headerText);
  const handleEditedNameChange = (name: string) => setEditedName(name);

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

  const handleSaveName = async () => {
    if (editedName !== event.eventName) {
      try {
        await dispatch(updateEventName({
          eventId: event.eventId,
          name: editedName
        }));
      } catch { }
    }
  };

  return (
    <Flex
      direction='column'
      align='stretch'
      justify='center'
      p='0.5rem'
    >
      <Editable
        as={Heading}
        isDisabled={!isEditable || !me}
        defaultValue={editedName}
        onChange={handleEditedNameChange}
        onSubmit={handleSaveName}
      >
        <EditablePreview />
        <Flex>
          <InputGroup>
            <EditableInput />
            <SubmitEditIcon />
          </InputGroup>
        </Flex>
      </Editable>
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


function SubmitEditIcon() {
  const { isEditing, getSubmitButtonProps } = useEditableControls();
  if (!isEditing) { return null; }
  return (
    <InputRightElement>
      <IconButton
        size={'md'}
        icon={<ChevronRightIcon />}
        aria-label={'Edit event name'}
        variant={'primary'}
        {...getSubmitButtonProps()}
      />
    </InputRightElement>
  );
}
