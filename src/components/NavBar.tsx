import { Box, Text } from "@chakra-ui/react";
import Link from "next/link";


const HOME_LINK = {
  display: "🏡",
  url: "/home"
};
const EVENT_LINK = {
  display: "🗓",
  url: "/events"
};
const PROFILE_LINK = {
  display: "⏰",
  url: "/profile"
};
const LINKS = [HOME_LINK, EVENT_LINK, PROFILE_LINK];

const NavBar = () => {
  return (
    <Box
      pos="fixed"
      bottom={0}
      right={0}
      left={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p="0.5rem"
      bg="black"
    >
      <Box
        as="nav"
        display="flex"
        justifyContent="space-between"
        width="90%"
      >
        {LINKS.map(({ display, url }) => (
          <Link key={display} href={url}>
            <a><Text fontSize={'20pt'} p={'0 2rem'}>{display}</Text></a>
          </Link>
        ))}
      </Box>
    </Box>
  )
};

export default NavBar;