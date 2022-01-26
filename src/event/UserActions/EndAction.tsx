import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Event } from "@/interfaces";
import { endEvent } from '../redux';
import { Button, ButtonGroup, Heading, Modal, ModalContent } from '@chakra-ui/react';
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
        <ModalContent p={'1rem'}>
          <Heading variant={'lg'}>
            Are you sure you want to end the event?
          </Heading>
          <ButtonGroup style={{
            marginTop: '1rem'
          }}>
            <Button onClick={() => setShow(false)}>
              Go Back
            </Button>
            <Button onClick={handleConfirmEndClick} variant="outline">
              End
            </Button>
          </ButtonGroup>
        </ModalContent>
      </Modal>
    </>
  )
}