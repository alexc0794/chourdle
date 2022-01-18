import React, { useEffect, useState } from "react";
import PlacesAutocomplete, {
  geocodeByPlaceId,
  getLatLng,
  Suggestion
} from "react-places-autocomplete";
import { Place } from "@/interfaces";
import useGoogleMaps from "@/hooks/useGoogleMaps";
import styles from "@/styles/SearchBar.module.css";


export interface SearchResult {
  name: string;
  place: Place;
};

const GOOGLE_PLACE_TYPES_TO_IGNORE: Array<string> = [
  "locality",
  "neighborhood",
  "route",
  "administrative_area_level_1"
];

type SearchBarProps = {
  initialSearchTerm?: string;
  autoFocus?: boolean;
  placeholder?: string;
  onClick?: () => void;
  onSelect?: (name: string, place: Place) => void;
};

function SearchBar({
  initialSearchTerm = "",
  autoFocus = false,
  placeholder = "🔍 Search destination",
  onClick = () => { },
  onSelect = () => { }
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const isGoogleLoaded = useGoogleMaps();

  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  if (!isGoogleLoaded) {
    return <div className={styles.container}><input className={styles.input} disabled /></div>;
  }

  async function handleSelect(
    address: string,
    googlePlaceId: string,
    suggestion?: Suggestion
  ) {
    const results = await geocodeByPlaceId(googlePlaceId);
    const { lat, lng } = await getLatLng(results[0]);
    setSearchTerm(address);
    const place: Place = {
      position: {
        latitude: lat,
        longitude: lng
      },
      googlePlaceId
    };
    if (suggestion) {
      place.mainText = suggestion.formattedSuggestion.mainText;
      place.secondaryText = suggestion.formattedSuggestion.secondaryText;
    }
    onSelect(address, place);
  }

  return (
    <div onClick={onClick}>
      <PlacesAutocomplete
        value={searchTerm}
        onChange={value => setSearchTerm(value)}
        onSelect={handleSelect}
        shouldFetchSuggestions={searchTerm.length > 3}
      >
        {({
          getInputProps,
          suggestions: unfilteredSuggestions,
          getSuggestionItemProps
        }) => {
          const suggestions = unfilteredSuggestions.filter(suggestion => {
            return (
              suggestion.types.length > 0 &&
              !GOOGLE_PLACE_TYPES_TO_IGNORE.find(
                ignoredType => suggestion.types[0] === ignoredType
              )
            );
          });
          return (
            <div className={styles.container}>
              <input
                {...getInputProps({
                  placeholder: placeholder,
                  className: styles.input,
                  autoFocus: autoFocus
                })}
              />
              {suggestions.length > 0 && (
                <div className={styles.suggestions}>
                  {suggestions.map((suggestion, i) => {
                    return (
                      <div key={suggestion.description}>
                        <div
                          {...getSuggestionItemProps(suggestion)}
                          className={styles.suggestion}
                        >
                          <div className={styles.mainText}>
                            {suggestion.formattedSuggestion.mainText}
                          </div>
                          <div className={styles.secondaryText}>
                            {suggestion.formattedSuggestion.secondaryText}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }}
      </PlacesAutocomplete>
    </div>
  );
}

export default SearchBar;
