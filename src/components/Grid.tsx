import { Letter, LetterStatus } from "@/interfaces";
import { Button, Flex, Input, InputGroup, Text } from "@chakra-ui/react";
import { KeyboardEvent } from "react";
import { enterLetter, removeLetter, selectWordle, submitAttempt } from "src/redux";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";


type WordleGridProps = {
  numCols: number;
  numRows: number;
};

export default function WordleGrid({
  numCols,
  numRows,
}: WordleGridProps) {
  const { attempts, hasFoundAnswer, currentAttempt } = useAppSelector(selectWordle);
  const dispatch = useAppDispatch();

  const handleType = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      return dispatch(removeLetter());
    } else if (currentAttempt.length >= numCols) {
      return;
    }
    else if (event.key.length > 1) {
      return;
    } else if (event.key === '0' || Number.parseInt(event.key)) {
      return;
    }
    dispatch(enterLetter({ letter: event.key.toLowerCase() }));
  }


  return (
    <>
      {Array.from(Array(numRows)).map((_, i) => (
        <WordleRow
          key={i}
          numCols={numCols}
          letters={(() => {
            if (i < attempts.length) {
              return attempts[i];
            } else if (i === attempts.length) {
              return currentAttempt;
            }
            return [];
          })()}
        />
      ))}
      <InputGroup m={'1rem 0'}>
        <Input
          id={'alexchou'}
          type={'text'}
          value={currentAttempt.map(({ letter }) => letter).join('')}
          onKeyDown={handleType}
          onChange={() => { }}
          maxLength={numCols}
          autoFocus
          disabled={hasFoundAnswer}
        />
        <Button
          size={'md'}
          onClick={() => dispatch(submitAttempt({ letters: currentAttempt }))}
          disabled={hasFoundAnswer || currentAttempt.length < numCols}
          colorScheme={'blue'}
        >
          Submit
        </Button>
      </InputGroup>
    </>
  );
}


type WordleRowProps = {
  numCols: number;
  letters: Letter[];
};

function WordleRow({
  numCols,
  letters,
}: WordleRowProps) {
  return (
    <Flex w={'100%'}>
      {Array.from(Array(numCols)).map((_, i) => (
        <Flex
          key={i}
          m={'0.25rem'}
          border={'3px solid'}
          borderColor={'background.gray'}
          w={'100%'}
          h={`${100 / numCols}vw`}
          justify={'center'}
          align={'center'}
          bg={
            (() => {
              if (letters.length <= i) return 'none';
              else if (letters[i].status === LetterStatus.FOUND_EXACT) return 'background.foundExact';
              else if (letters[i].status === LetterStatus.FOUND_IN_WORD) return 'background.foundInWord';
              else if (letters[i].status === LetterStatus.NOT_FOUND) return 'background.notFound'
              return 'none';
            })()
          }
        >
          <Text fontSize={'3em'}>
            {letters.length > i ? letters[i].letter.toUpperCase() : ''}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
}