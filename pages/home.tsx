import { useRouter } from 'next/router';
import SearchBar from '@/components/SearchBar'
import useLoginRedirect from '@/hooks/useLoginRedirect';
import ActiveEvents from 'src/home/ActiveEvents';
import { Box } from '@chakra-ui/react';
import NavBar from '@/components/NavBar';


export default function Home() {
  const { isLoggedIn } = useLoginRedirect();

  const router = useRouter();
  const handleSearchBarClick = () => {
    router.push('/create');
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <Box>
        <SearchBar onClick={handleSearchBarClick} />
        <ActiveEvents />
      </Box>
      <NavBar />
    </>
  );
}
