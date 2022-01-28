import { useAppDispatch } from "@/hooks/useRedux";
import { Heading } from "@chakra-ui/react";
import { ArrowBackIcon, SettingsIcon } from "@chakra-ui/icons";
import { logout } from "src/session/redux";
import HeaderNavBar from "@/components/HeaderNavBar";


export default function ProfileNavBar({ phoneNumber }: {
  phoneNumber: string
}) {
  const dispatch = useAppDispatch();
  const handleClickLogout = () => dispatch(logout());

  return (
    <>
      <HeaderNavBar
        title={<Heading variant={'md'}>{phoneNumber}</Heading>}
        icon={<SettingsIcon />}
        actions={[
          {
            text: 'Logout',
            icon: <ArrowBackIcon mr={'10px'} />,
            onClick: handleClickLogout
          }
        ]}
      />
    </>
  );
}
