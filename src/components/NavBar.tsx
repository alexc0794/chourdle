import { Box, Text } from "@chakra-ui/react";
import Link from "next/link";


const HOME_LINK = {
  display: "Home",
  url: "/"
};
const EVENT_LINK = {
  display: "Events",
  url: "/events"
};
const PROFILE_LINK = {
  display: "Profile",
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
      bg="background.dark"
    >
      <Box
        as="nav"
        display="flex"
        justifyContent="space-between"
        padding="0.5rem 1rem"
        width="90%"
      >

        {LINKS.map(({ display, url }) => (
          <Link key={display} href={url}>
            <a>
              <Text p="0.5rem 1rem" color="white">{display}</Text>
            </a>
          </Link>
        ))}
      </Box>
    </Box>
  )
};

export default NavBar;