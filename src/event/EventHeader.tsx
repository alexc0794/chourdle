import { useMemo, useState } from "react";
import { TRANSPORT_MODE_TO_DIRECTIONS_MODE } from "src/constants";
import { Event, EventUser } from "@/interfaces";
import { useAppDispatch } from "@/hooks/useRedux";
import { updateEventName } from "./redux";
import { Box, Editable, EditableInput, EditablePreview, Flex, Heading, IconButton, InputGroup, InputRightElement, LinkBox, LinkOverlay, Skeleton, SkeletonText, Stack, Text, useEditableControls } from "@chakra-ui/react";
import { ChevronRightIcon } from '@chakra-ui/icons'
import { getPlatform } from "src/utils/os";


const DEFAULT_GOOGLE_MAPS_DIRECTIONS_URL = 'https://www.google.com/maps/dir/';
const PLATFORM_TO_GOOGLE_MAPS_DIRECTIONS_URL = {
  'Android': DEFAULT_GOOGLE_MAPS_DIRECTIONS_URL, // TODO
  'iOS': 'comgooglemaps://',
  'Web': DEFAULT_GOOGLE_MAPS_DIRECTIONS_URL,
};

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

  const platform = getPlatform();
  const url = useMemo(() => {
    const url = (platform && PLATFORM_TO_GOOGLE_MAPS_DIRECTIONS_URL[platform]) || DEFAULT_GOOGLE_MAPS_DIRECTIONS_URL;
    const params = (() => {
      let destination = `${event.place.mainText} ${event.place.secondaryText}`;
      if (!destination.trim().length) {
        destination = `${event.place.position.latitude},${event.place.position.longitude}`;
      }

      switch (platform) {
        case 'iOS':
          return new URLSearchParams({
            daddr: destination,
            ...(me && me.transportMode !== null && me.transportMode in TRANSPORT_MODE_TO_DIRECTIONS_MODE ? {
              directionsmode: TRANSPORT_MODE_TO_DIRECTIONS_MODE[me.transportMode],
            } : {}),
          });
        default:
          return new URLSearchParams({
            api: '1',
            destination,
            ...(event.place.googlePlaceId ? {
              destination_place_id: event.place.googlePlaceId
            } : {}),
            ...(me && me.transportMode !== null && me.transportMode in TRANSPORT_MODE_TO_DIRECTIONS_MODE ? {
              travelmode: TRANSPORT_MODE_TO_DIRECTIONS_MODE[me.transportMode],
            } : {}),
          });
      }
    })();
    return `${url}?${params.toString()}`
  }, [platform, event.place, me?.transportMode]);

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
    <Stack p='0.5rem' spacing={0}>
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
      <LinkBox>
        <LinkOverlay isExternal href={url}>
          <Box color={'font.lightgray'} fontWeight={300}>
            {event.eventName === event.place.mainText ? (
              <Text fontSize='12pt' mb='0.1rem'>{'📍 '}{event.place.secondaryText || ''}</Text>
            ) : (
              <>
                {event.place.mainText && <Text fontSize='12pt' mb='0.1rem'>{'📍 '}{event.place.mainText}</Text>}
                {event.place.secondaryText && <Text fontSize='12pt' mb='0.1rem'>{event.place.secondaryText}</Text>}
              </>
            )}
          </Box>
        </LinkOverlay>
      </LinkBox>
    </Stack>
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


export function EventHeaderSkeleton() {
  return (
    <Stack p={'0.5rem'}>
      <Skeleton height={'40px'} w={'50%'} />
      <SkeletonText noOfLines={1} />
    </Stack>
  );
}
