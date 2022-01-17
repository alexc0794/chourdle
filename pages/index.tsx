import { useRouter } from 'next/router';
import SearchBar from '@/components/SearchBar'


export default function Home() {
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

