import { useState } from "react";
import SearchBar, { SearchResult } from "../components/SearchBar";
import { Place } from "../interfaces";


export default function Create() {
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  function handleSearchBarSelect(name: string, place: Place) {
    if (document.activeElement) {
      try {
        (document.activeElement as HTMLElement).blur();
      } catch (error) {
        console.error(error);
      }
    }
    setSearchResult({ name, place });
  }

  return (
    <div>
      <SearchBar
        autoFocus
        onSelect={handleSearchBarSelect}
      />
    </div>
  )
}