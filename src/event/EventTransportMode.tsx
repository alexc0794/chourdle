import { useAppDispatch } from "@/hooks/useRedux";
import { TransportMode } from "@/interfaces";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel } from "@chakra-ui/react";
import { useState } from "react";
import { updateTransportMode } from "./redux";

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
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);

  const dispatch = useAppDispatch();
  const handleTransportModeClick = async (transportMode: TransportMode) => {
    setActiveKey(undefined);
    await dispatch(updateTransportMode({ eventId, transportMode }));
  };

  if (transportMode === null) return null;

  return (
    <Accordion allowToggle>
      <AccordionItem>
        <AccordionButton>
          {TransportMode[transportMode]}{' '}
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>

        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}