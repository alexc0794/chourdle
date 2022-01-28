import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { TransportMode } from "@/interfaces";
import { Center, Heading, HStack, Stack, Stat, StatArrow, StatGroup, StatLabel, StatNumber } from "@chakra-ui/react";
import { useEffect } from "react";
import { getTimeUnits } from "src/utils/time";
import { fetchMyStats, fetchUserStats, selectUserStats } from "./redux";


export default function UserStats({
  phoneNumber
}: {
  phoneNumber?: string
}) {
  const userStats = useAppSelector(selectUserStats);
  const dispatch = useAppDispatch();
  const load = async () => {
    // TODO: Consider refactoring this. My profile and other user's profile will prob be separated by design eventually
    if (phoneNumber) {
      dispatch(fetchUserStats(phoneNumber));
    } else {
      dispatch(fetchMyStats());
    }
  }

  useEffect(() => { load(); }, []);
  const statProps = {
    minW: '100px'
  };

  return (
    <Stack p={'1rem'} spacing={8} justify={'center'}>
      {userStats && userStats.sumMinutes !== null && (
        <TimeWallet timeMinutes={userStats.sumMinutes} />
      )}
      {userStats && (
        <Center>
          <StatGroup
            p={'1rem'}
            background={'background.dark'}
            whiteSpace={'nowrap'}
            boxShadow={'0 0 2px black'}
          >
            <Stat {...statProps}>
              <StatLabel>Events</StatLabel>
              <StatNumber>{userStats.totalEvents || 0}</StatNumber>
            </Stat>
            <Stat {...statProps}>
              <StatLabel>Favorite</StatLabel>
              {userStats.favoriteTransportMode === null ? (
                <StatNumber>None</StatNumber>
              ) : (
                <StatNumber>{TransportMode[userStats.favoriteTransportMode]}</StatNumber>
              )}
            </Stat>
            <Stat {...statProps}>
              <StatLabel>Timeliness</StatLabel>
              {userStats.avgMinutes === null ? (
                <StatNumber>0</StatNumber>
              ) : (
                <StatNumber>
                  <StatArrow type={userStats.avgMinutes >= 0 ? 'increase' : 'decrease'} />
                  {Math.abs(userStats.avgMinutes)} min
                </StatNumber>
              )}
            </Stat>
          </StatGroup>
        </Center>
      )
      }
    </Stack >
  );
}

function TimeWallet({ timeMinutes }: { timeMinutes: number }) {
  const { days, hours, minutes } = getTimeUnits(timeMinutes * 60 * 1000);
  const containerProps = {
    border: '3px solid',
    borderColor: 'background.gray',
    align: 'center',
    p: '1rem',
    minWidth: '100px',
    boxShadow: '0 0 2px black',
  };

  const headerProps = {
    fontSize: '36pt',
  };

  const subheaderProps = {
    fontSize: '14pt',
    fontWeight: 300
  };

  return (
    <Center>
      <HStack>
        <Stack {...containerProps}>
          <Heading {...headerProps}
          >{days}</Heading>
          <Heading {...subheaderProps}>Days</Heading>
        </Stack>
        <Stack {...containerProps}>
          <Heading {...headerProps}>{hours}</Heading>
          <Heading {...subheaderProps}>Hours</Heading>
        </Stack>
        <Stack {...containerProps}>
          <Heading {...headerProps}>{minutes}</Heading>
          <Heading {...subheaderProps}>Minutes</Heading>
        </Stack>
      </HStack>
    </Center>
  );
}
