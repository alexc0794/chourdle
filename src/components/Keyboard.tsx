import { Letter, LetterStatus } from "@/interfaces";
import { Button, Flex, Stack } from "@chakra-ui/react";
import { enterLetter, selectWordle } from "src/redux";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";


function getButtonBackground(letterStatus?: LetterStatus) {
  if (letterStatus === LetterStatus.FOUND_EXACT) {
    return 'background.foundExact';
  } else if (letterStatus === LetterStatus.FOUND_IN_WORD) {
    return 'background.foundInWord';
  } else if (letterStatus === LetterStatus.NOT_FOUND) {
    return 'background.notFound';
  }
  return 'gray.500';
}


export default function Keyboard() {
  const dispatch = useAppDispatch();
  const handleLetterClick = (letter: string) => {
    console.log(letter);
    dispatch(enterLetter({ letter }));
  };
  const { letterMapping } = useAppSelector(selectWordle)

  const buttonProps = {
    p: '1.5rem 1rem',
    m: '0.1rem',
    minWidth: 0,
  };
  return (
    <Stack spacing={2}>
      <Flex w={'100%'}>
        {'qwertyuiop'.split('').map(letter => (
          <Button
            key={letter}
            {...buttonProps}
            onClick={() => handleLetterClick(letter)}
            bg={getButtonBackground(letterMapping[letter])}
          >
            {letter}
          </Button>
        ))}
      </Flex>
      <Flex>
        {'asdfghjkl'.split('').map(letter => (
          <Button
            key={letter}
            {...buttonProps}
            onClick={() => handleLetterClick(letter)}
            bg={getButtonBackground(letterMapping[letter])}
          >{letter}</Button>
        ))}
      </Flex>
      <Flex>
        <Button {...buttonProps}>Enter</Button>
        {'zxcvbnm'.split('').map(letter => (
          <Button
            key={letter}
            {...buttonProps}
            onClick={() => handleLetterClick(letter)}
            bg={getButtonBackground(letterMapping[letter])}
          >{letter}</Button>
        ))}
        <Button {...buttonProps}>Back</Button>
      </Flex>
    </Stack>
  );
}
