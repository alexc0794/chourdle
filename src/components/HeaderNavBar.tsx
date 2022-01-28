import { ReactElement } from "react";
import { Flex, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";


type NavBarAction = {
  text: string;
  icon?: ReactElement;
  onClick: () => void;
};

type NavBarProps = {
  title?: ReactElement;
  icon: ReactElement;
  actions: NavBarAction[];
};

export default function HeaderNavBar({ title, icon, actions }: NavBarProps) {
  return (
    <Flex
      alignItems={'center'}
      justify={'space-between'}
      background={'background.dark'}
      p={'0 0.5rem'}
    >
      {title}
      {actions.length > 0 && (
        <Menu>
          <MenuButton
            fontSize={'12pt'}
            color={'white'}
            p={'0.5rem'}
          >
            {icon}
          </MenuButton>
          <MenuList
            alignItems={'center'}
            color={'black'}
          >
            {actions.map(({ text, icon, onClick }) => (
              <MenuItem
                key={text}
                onClick={onClick}
              >
                {icon}
                {text}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      )}
    </Flex >
  );
}
