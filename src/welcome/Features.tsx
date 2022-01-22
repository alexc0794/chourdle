import { Box, Flex, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { ReactElement } from "react";


export default function Features() {
  function Feature({ title, text, icon }: {
    title: string,
    text?: string,
    icon: ReactElement,
  }) {
    return (
      <Stack p={'0.5rem'} align={'center'} textAlign={'center'}>
        <Flex
          w={10}
          h={10}
          align={'center'}
          justify={'center'}
          rounded={'full'}
          bg={'background.gray'}
          fontSize={'16pt'}
        >
          {icon}
        </Flex>
        <Text fontSize={'13pt'} fontWeight={500}>{title}</Text>
        {
          text && (
            <Text fontSize={'12pt'} color={'font.lightgray'}>{text}</Text>
          )
        }
      </Stack >
    );
  }
  return (
    <Box
      p={'1rem'}
    >
      <SimpleGrid
        p={'0.5rem'}
        borderRadius={'0.5rem'}
        columns={{ base: 2, md: 4 }}
        spacing={'1rem'}
        bg={'background.dark'}
      >
        <Feature
          icon={<span>🗓</span>}
          title={'Make Plans'}
        />
        <Feature
          icon={<span>🫂</span>}
          title={'Invite Friends'}
        />
        <Feature
          icon={<span>📍</span>}
          title={'Get ETA Updates'}
        />
        <Feature
          icon={<div>💸</div>}
          title={'Win Money for Arriving on Time'}
        />
      </SimpleGrid>
    </Box>
  );
}
