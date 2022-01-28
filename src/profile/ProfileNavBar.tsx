import { useAppDispatch } from "@/hooks/useRedux";
import { Flex, Heading, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { logout } from "src/session/redux";


export default function ProfileNavBar({ phoneNumber }: {
  phoneNumber: string
}) {
  const dispatch = useAppDispatch();
  const handleClickLogout = () => dispatch(logout());

  return (
    <Flex
      alignItems={'center'}
      justify={'space-between'}
      background={'background.dark'}
      p={'0 0.5rem'}
    >
      <Heading
        fontSize={'14pt'}
      >
        {phoneNumber}
      </Heading>
      <Menu>
        <MenuButton
          fontSize={'12pt'}
          color={'white'}
          p={'0.5rem'}
        >
          <HamburgerIcon />
        </MenuButton>
        <MenuList
          alignItems={'center'}
          color={'black'}
        >
          <MenuItem onClick={handleClickLogout}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}
