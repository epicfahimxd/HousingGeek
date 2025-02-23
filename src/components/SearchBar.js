"use client";
import React, { useState, useEffect, useRef } from "react";

const SearchBar = ({ onPlaceSelected }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    // Ensure the Google Maps API is available and we haven't already initialized Autocomplete.
    if (window.google && inputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          // Optionally, add options like componentRestrictions or types:
          // componentRestrictions: { country: "us" },
          // types: ["geocode"],
        }
      );

      // Listen for the place_changed event
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        console.log("Selected place:", place);

        if (place && place.geometry && place.geometry.location) {
          // Get the new center from the place's location
          const newCenter = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };

          // Update the input with the formatted address or name
          setQuery(place.formatted_address || place.name);

          // Pass the new center up to the parent component
          if (onPlaceSelected) {
            onPlaceSelected(newCenter);
          }
        }
      });
    }
  }, [onPlaceSelected]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Optionally, if the user presses Enter without selecting a suggestion,
    // you might perform additional logic here (like geocoding the query).
    console.log("Search submitted:", query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex bg-slate-200 rounded-md overflow-hidden absolute top-4 left-1/2 transform -translate-x-1/2 z-10"
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for a location..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 w-[950px] px-4 py-[12px] text-left focus:outline-none"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-5 py-2 hover:bg-blue-600"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;