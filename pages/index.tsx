import { useRouter } from 'next/router';
import SearchBar from '../components/SearchBar'
import styles from '../styles/Home.module.css'

export default function Home() {
  const router = useRouter();
  const handleSearchBarClick = () => {
    router.push('/create');
  };

  return (
    <div className={styles.container}>
      <SearchBar onClick={handleSearchBarClick} />
    </div>
  );
}

