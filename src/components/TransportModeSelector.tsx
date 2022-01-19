import React, { useState } from "react";
import { Button } from "@chakra-ui/react";
import { Eta, TransportMode } from "@/interfaces";
import useTransportMode from "@/hooks/useTransportMode";
import Card from "./Card";


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

  function handleSelect(transportMode: TransportMode) {
    setSelectedTransportMode(transportMode);
  }

  return (
    <div className="TransportModeSelector">
      <div className="TransportModeSelector-labels">
        <div>
          Transport Mode
        </div>
        <div>
          Commute Time
        </div>
      </div>
      {modes.map((mode: string) => {
        const transportMode = TransportMode[mode as keyof typeof TransportMode];
        return (
          <Card
            key={mode}
            bg={selectedTransportMode === transportMode ? "secondary" : "dark"}
            onClick={() => handleSelect(transportMode)}
            className="TransportModeSelector-mode"
          >
            <div className="TransportModeSelector-mode-name">{mode}</div>
            <div className="TransportModeSelector-mode-details">
              <TransportModeDetails
                transportMode={transportMode}
                googlePlaceId={googlePlaceId}
              />
            </div>
          </Card>
        );
      })}
      <div className="TransportModeSelector-button-wrapper">
        <Button
          disabled={selectedTransportMode === null}
          onClick={() => selectedTransportMode !== null && onSelect(selectedTransportMode)}
          size="lg"
          className="TransportModeSelector-button"
        >
          {selectedTransportMode === null ? 'Choose a mode' : type}
        </Button>
      </div>
    </div >
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
  return (
    <div>
      {eta === null ? (
        <span>Calculating...</span>
      ) : (
        <span>{Math.round(eta.durationMs / 1000 / 60)} minutes</span>
      )}
    </div>
  );
}

export default React.memo(TransportModeSelector);
