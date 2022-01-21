import { useEffect, useState } from 'react';
import { useAppSelector } from '@/hooks/useRedux';
import { Event, EventUser, User } from '@/interfaces';
import { selectMe } from 'src/event/redux';
import { selectToken } from 'src/session/redux';
import { Center, Checkbox, Flex, Icon, IconButton, Spinner, Stack, Text } from '@chakra-ui/react';
import { CheckCircleIcon } from "@chakra-ui/icons";
import { getFollowing } from 'src/profile/api';


type InviteSuggestionsProps = {
  event: Event,
  selectedPhoneNumbers: string[],
  onSelect: (user: User) => void,
};

export default function InviteSuggestions({
  event,
  selectedPhoneNumbers,
  onSelect
}: InviteSuggestionsProps) {
  const me: EventUser | null = useAppSelector(selectMe) || null;
  const token: string | null = useAppSelector(selectToken) || null;
  const [followers, setFollowers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    // TODO: Eventually make an endpoint to get invite recommendations and handle filter logic on the backend
    async function fetchFollowing(token: string) {
      setLoading(true);
      const users = await getFollowing(token);
      setFollowers(users);
      setLoading(false);
    }

    if (token) fetchFollowing(token);
  }, [token]);

  if (!me) {
    return null;
  }

  const eventUserPhoneNumbers = new Set();
  for (let i = 0; i < event.eventUsers.length; i++) {
    eventUserPhoneNumbers.add(event.eventUsers[i].phoneNumber);
  }

  const suggestions = followers.filter(follower => !eventUserPhoneNumbers.has(follower.phoneNumber))
  if (suggestions.length === 0 && loading) {
    return (
      <Center p={'1rem'}><Spinner /></Center>
    );
  } else if (suggestions.length === 0 && !loading) {
    return (
      <Center p={'1rem'}>
        No suggestions.
      </Center>
    );
  }

  return (
    <Stack>
      {suggestions.map(suggestion => (
        <Flex
          key={suggestion.phoneNumber}
          onClick={(e) => onSelect(suggestion)}
          justify={'space-between'}
          p={'0.5rem 1rem'}
        >
          <Stack spacing={0}>
            <Text fontSize={'12pt'}>{suggestion.name}</Text>
            <Text fontSize={'10pt'}>{suggestion.phoneNumber}</Text>
          </Stack>
          <Center>
            {selectedPhoneNumbers.includes(suggestion.phoneNumber) ? (
              <CheckCircleIcon />
            ) : (
              <Icon viewBox='0 0 200 200'>
                <path
                  fill='transparent'
                  stroke='white'
                  strokeWidth={5}
                  d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
                />
              </Icon>
            )}
          </Center>
        </Flex>
      ))}
    </Stack>
  )
}
