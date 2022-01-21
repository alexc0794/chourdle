import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Event } from "@/interfaces";
import { endEvent } from '../redux';
import { Button, ButtonGroup, Modal, ModalContent } from '@chakra-ui/react';
import { SmallCloseIcon } from '@chakra-ui/icons';


export default function EndAction({ event }: { event: Event }) {
  const dispatch = useDispatch();
  const [show, setShow] = useState<boolean>(false);

  const handleConfirmEndClick = async () => {
    setShow(false);
    await dispatch(endEvent(event.eventId));
  };

  return (
    <>
      <Button
        onClick={() => setShow(true)}
        variant="link"
        leftIcon={<SmallCloseIcon />}
      >
        End
      </Button>
      <Modal
        variant={'light'}
        isOpen={show}
        onClose={() => setShow(false)}
        isCentered
      >
        <ModalContent>
          <h4>
            Are you sure you want to end the event?
          </h4>
          <ButtonGroup style={{
            marginTop: '1rem'
          }}>
            <Button onClick={() => setShow(false)} variant="secondary">
              Go Back
            </Button>
            <Button onClick={handleConfirmEndClick} variant="danger">
              End
            </Button>
          </ButtonGroup>
        </ModalContent>
      </Modal>
    </>
  )
}