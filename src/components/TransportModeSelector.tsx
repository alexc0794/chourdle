import React, { useState } from "react";
import { Box, Button, Container, Flex, Spacer, Text } from "@chakra-ui/react";
import { Eta, TransportMode } from "@/interfaces";
import useTransportMode from "@/hooks/useTransportMode";
import Card from "./Card";
import { getTimeUnits } from "src/utils/time";
import { shimmer } from "src/chakra/animation";


type TransportModeSelectorProps = {
  type: "Create" | "Join";
  initiallySelectedTransportMode?: TransportMode;
  googlePlaceId?: string;
  onSelect: (transportMode: TransportMode) => void;
};

function TransportModeSelector({
  type,
  initiallySelectedTransportMode,
  googlePlaceId,
  onSelect,
}: TransportModeSelectorProps) {
  const modes = Object.keys(TransportMode).filter((key: any) =>
    isNaN(Number(key))
  ); // TODO: Get modes from backend

  const [
    selectedTransportMode,
    setSelectedTransportMode,
  ] = useState<TransportMode | null>(initiallySelectedTransportMode || null);

  const handleSelect = (transportMode: TransportMode) => setSelectedTransportMode(transportMode);

  const disabled = selectedTransportMode === null;
  const shimmerProps = !disabled ? {
    bg: 'linear-gradient(45deg, #d422b1, #ffce00)',
    animation: `${shimmer} 10s ease infinite`,
    bgSize: '200% 200%',
    variant: 'none'
  } : {};

  return (
    <Container p={'0.5rem 0'} direction={'column'}>
      <Flex direction={'row'} m={'0.5rem'} color='font.lightgray'>
        <Text>Transport Mode</Text>
        <Spacer />
        <Text>Commute Time</Text>
      </Flex>
      {modes.map((mode: string) => {
        const transportMode = TransportMode[mode as keyof typeof TransportMode];
        return (
          <Card
            key={mode}
            borderTop={'1px solid rgba(0,0,0,.125)'}
            p={'0.75rem 1rem'}
            bg={selectedTransportMode === transportMode ? "black" : "background.dark"}
            onClick={() => handleSelect(transportMode)}
          >
            <Flex w={'100%'} justify={'space-between'} p={'0.5rem'}>
              <Text>{mode}</Text>
              <TransportModeDetails
                transportMode={transportMode}
                googlePlaceId={googlePlaceId}
              />
            </Flex>
          </Card>
        );
      })}
      <Flex justify={'center'} p={'1rem'}>
        <Button
          disabled={disabled}
          onClick={() => selectedTransportMode !== null && onSelect(selectedTransportMode)}
          size={'lg'}
          variant={'outline'}
          {...shimmerProps}
        >
          {selectedTransportMode === null ? 'Choose a mode' : type}
        </Button>
      </Flex>
    </Container>
  );
}

type TransportModeDetailsProps = {
  transportMode: TransportMode;
  googlePlaceId?: string;
};

export function TransportModeDetails({
  transportMode,
  googlePlaceId,
}: TransportModeDetailsProps) {
  const eta: Eta | null = useTransportMode(transportMode, googlePlaceId || null);
  let text = 'Calculating...';
  if (eta) {
    const { days, hours, minutes } = getTimeUnits(eta.durationMs);
    text = (() => {
      const units: string[] = [];
      if (days) {
        units.push(`${days} d`);
      }
      if (hours) {
        units.push(`${hours} hr`);
      }
      if (minutes) {
        units.push(`${minutes} min`);
      }
      return units.join(' ').trim();
    })();
  }

  return (
    <Box>
      <Text>{text}</Text>
    </Box>
  );
}

export default React.memo(TransportModeSelector);
