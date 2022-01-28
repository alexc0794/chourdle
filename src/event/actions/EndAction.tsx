import { Button, ButtonGroup, Heading, Modal, ModalContent, ModalOverlay } from '@chakra-ui/react';
import { useAppDispatch } from '@/hooks/useRedux';
import { endEvent } from '../redux';


export default function EndAction({
  eventId,
  onClose,
}: {
  eventId: string,
  onClose: () => void,
}) {
  const dispatch = useAppDispatch();
  const handleConfirmEndClick = async () => {
    onClose();
    await dispatch(endEvent(eventId));
  };

  return (
    <Modal
      variant={'light'}
      isOpen
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent p={'1rem'}>
        <Heading variant={'lg'}>
          Are you sure you want to end the event?
        </Heading>
        <ButtonGroup style={{
          marginTop: '1rem'
        }}>
          <Button onClick={onClose}>
            Go Back
          </Button>
          <Button onClick={handleConfirmEndClick} variant="outline">
            End
          </Button>
        </ButtonGroup>
      </ModalContent>
    </Modal>
  )
}
