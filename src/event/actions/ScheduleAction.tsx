import { useAppSelector } from "@/hooks/useRedux";
import { Eta, Event } from "@/interfaces";
import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { MemoizedEventPageScheduleTimer } from "../EventScheduler";
import { selectEta } from "../redux";


export default function ScheduleAction({
  event,
  onClose
}: {
  event: Event,
  onClose: () => void,
}) {
  const eta: Eta | null = useAppSelector(selectEta);

  return (
    <Modal
      isOpen
      onClose={onClose}
      variant={'light'}
    >
      <ModalOverlay />
      <ModalContent>
        <MemoizedEventPageScheduleTimer
          eventId={event.eventId}
          scheduledForMs={event.scheduledForMs}
          eta={eta}
          onSchedule={onClose}
        />
      </ModalContent>
    </Modal>
  );
}
