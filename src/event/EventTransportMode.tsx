import { TransportModeDetails } from "@/components/TransportModeSelector";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { TransportMode } from "@/interfaces";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Flex,
  Heading,
  Spacer,
  Stack,
  Text
} from "@chakra-ui/react";
import { selectTransportMode, updateTransportMode } from "./redux";

const MODES = Object.keys(TransportMode).filter((key: any) =>
  isNaN(Number(key))
);

type EventTransportModeProps = {
  eventId: string;
  transportMode: TransportMode | null;
  googlePlaceId?: string;
};


export default function EventTransportMode({
  eventId,
  transportMode,
  googlePlaceId,
}: EventTransportModeProps) {
  const dispatch = useAppDispatch();
  const {
    loading,
    error,
    transportMode: pendingTransportMode
  } = useAppSelector(selectTransportMode);
  const handleTransportModeClick = async (transportMode: TransportMode) => {
    await dispatch(updateTransportMode({ eventId, transportMode }));
  };

  if (transportMode === null) return null;

  return (
    <Accordion
      allowToggle
      bg={'background.dark'}
    >
      <AccordionItem border={'none'}>
        <AccordionButton>
          <Stack w={'100%'}>
            <Flex color='font.lightgray'>
              <Heading variant={'sm'}>Commute time</Heading>
              <Spacer />
              <Heading variant={'sm'}>Travel by</Heading>
            </Flex>
            <Flex grow={1}>
              <TransportModeDetails transportMode={transportMode} googlePlaceId={googlePlaceId} />
              <Spacer />
              <Flex align={'center'}>
                <Text fontSize={'12pt'} mr={'0.25rem'}>
                  {TransportMode[transportMode]}
                </Text>
                <AccordionIcon fontSize={'18pt'} />
              </Flex>
            </Flex>
          </Stack>
        </AccordionButton>
        <AccordionPanel p={0}>
          <>
            {MODES.map((mode: string) => {
              const currentTransportMode = TransportMode[mode as keyof typeof TransportMode];
              return (
                <Flex
                  key={`${mode}${currentTransportMode}`}
                  display={currentTransportMode === transportMode ? 'none' : 'flex'}
                  align={'center'}
                  borderTop={'1px solid rgba(0,0,0,.125)'}
                  p={'0.75rem 1rem'}
                >
                  <TransportModeDetails transportMode={currentTransportMode} googlePlaceId={googlePlaceId} />
                  <Spacer />
                  <Button
                    colorScheme={'blue'}
                    variant={'outline'}
                    onClick={() => handleTransportModeClick(currentTransportMode)}
                    isLoading={pendingTransportMode === currentTransportMode}
                    disabled={loading}
                  >
                    Switch to {mode}
                  </Button>
                </Flex>
              );
            })}
          </>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}