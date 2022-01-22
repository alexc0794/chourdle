import { Heading, Link, SimpleGrid, Stack } from "@chakra-ui/react";



export default function Footer() {
  const headingProps = {
    fontSize: '14pt',
    fontWeight: 300,
    color: 'font.lightgray'
  };

  return (
    <Stack
      pt={'3rem'}
      align={'center'}
    >
      <SimpleGrid
        columns={2}
        spacing={16}
      >
        <Stack>
          <Heading {...headingProps}>
            Product
          </Heading>
          <Link href={'https://www.linkedin.com/in/alexanderchou/'}>Give Feedback</Link>
        </Stack>
        <Stack>
          <Heading {...headingProps}>
            Company
          </Heading>
          <Link href={'https://www.linkedin.com/in/alexanderchou/'}>Contact</Link>
        </Stack>
      </SimpleGrid>
    </Stack>
  );
}
