import { useRouter } from 'next/router';
import SearchBar from '@/components/SearchBar'
import useLoginRedirect from '@/hooks/useLoginRedirect';


export default function Home() {
  useLoginRedirect();

  const router = useRouter();
  const handleSearchBarClick = () => {
    router.push('/create');
  };

  return (
    <div>
      <SearchBar onClick={handleSearchBarClick} />
    </div>
  );
}

