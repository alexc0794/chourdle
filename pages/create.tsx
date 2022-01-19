import { useState } from "react";
import SearchBar, { SearchResult } from "@/components/SearchBar";
import { Event, Place, TransportMode } from "@/interfaces";
import useLoginRedirect from "@/hooks/useLoginRedirect";
import { Button, Flex, Stack } from "@chakra-ui/react";
import TransportModeSelector from "@/components/TransportModeSelector";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/hooks/useRedux";
import { createEvent } from "src/event/redux";


export default function Create() {
  useLoginRedirect();
  const dispatch = useAppDispatch();
  const { push } = useRouter();
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  const handleSearchBarSelect = (name: string, place: Place) => {
    if (document.activeElement) {
      try {
        (document.activeElement as HTMLElement).blur();
      } catch (error) {
        console.error(error);
      }
    }
    setSearchResult({ name, place });
  }

  const handleTransportModeSelect = async (transportMode: TransportMode) => {
    if (!searchResult) return;

    try {
      const { payload } = await dispatch(
        createEvent({
          name: searchResult.place.mainText || searchResult.name,
          place: searchResult.place,
          transportMode,
        })
      );
      const event = payload as Event | null;
      if (event) push(`/events/${event.eventId}`);
    } catch { }
  };

  const handleCancelClick = () => push('/');

  return (
    <Stack>
      <SearchBar
        autoFocus
        onSelect={handleSearchBarSelect}
      />
      {searchResult && (
        <TransportModeSelector
          type="Create"
          googlePlaceId={searchResult.place.googlePlaceId}
          onSelect={handleTransportModeSelect}
        />
      )}
      <Flex justify={'center'}>
        <Button
          colorScheme={'blue'}
          size={'lg'}
          variant={'link'}
          onClick={handleCancelClick}
        >
          Cancel
        </Button>
      </Flex>
    </Stack>
  );
}