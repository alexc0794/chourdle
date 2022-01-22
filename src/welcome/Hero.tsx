import { Box, Heading, keyframes, ListItem, Stack, UnorderedList } from "@chakra-ui/react";


const TIME_WORDS = [
  'late',
  'early',
  'whenever',
]; // WARNING: Current animation config works for 3 words

const GOOD_WORDS = [
  'guilt-free',
  'rewarding',
  'simple',
]; // WARNING: Current animation config works for 3 words

const wordSlider = keyframes`
  0%, 27% {
    transform: translateY(0%);
  }
  33%, 60% {
    transform: translateY(-25%);
  }
  66%, 93% {
    transform: translateY(-50%);
  }
  100% {
    transform: translateY(-75%);
  }
`;

export default function Hero() {
  const textProps = {
    fontSize: 'min(12vw, 12vh)',
    fontWeight: 700,
  };
  return (
    <Box
      p={'1.5rem'}
    >
      <Stack spacing={0}>
        <Heading
          {...textProps}

        >
          Showing up
        </Heading>
        <Heading
          {...textProps}
          display={'inline-block'}
          overflow={'hidden'}
          height={'1.5em'}
          verticalAlign={'middle'}
        >
          <UnorderedList
            animation={`${wordSlider} 12s ease-out infinite`}
            listStyleType={'none'}
            m={0}
          >
            {TIME_WORDS.map((word, i) => (
              <ListItem
                key={word}
                lineHeight={'1.3em'}
              >
                {word}
              </ListItem>
            ))}
            <ListItem lineHeight={'1.3em'}>
              {TIME_WORDS[0]}
            </ListItem>
          </UnorderedList>
        </Heading>
        <Heading
          {...textProps}
          textAlign={'end'}
        >
          never felt so
        </Heading>
        <Heading
          {...textProps}
          display={'inline-block'}
          overflow={'hidden'}
          height={'1.5em'}
          verticalAlign={'middle'}
          textAlign={'end'}
        >
          <UnorderedList
            animation={`${wordSlider} 12s ease-out infinite`}
            listStyleType={'none'}
            m={0}
          >
            {GOOD_WORDS.map((word, i) => (
              <ListItem
                key={word}
                lineHeight={'1.3em'}
              >
                {word}
              </ListItem>
            ))}
            <ListItem lineHeight={'1.3em'}>
              {GOOD_WORDS[0]}
            </ListItem>
          </UnorderedList>
        </Heading>
      </Stack>
    </Box>
  )
}
