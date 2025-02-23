"use client";
import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, Circle } from "@react-google-maps/api";
import Popup from "./Popup";
import SearchBar from "./SearchBar"; // Ensure the correct import path

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const mapOptions = {
  disableDefaultUI: false,
  styles: [
    {
      featureType: "poi",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
  ],
};

const Map = () => {
  const [center, setCenter] = useState({ lat: 42.4085, lng: -71.1183 });
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHouse, setSelectedHouse] = useState(null);

  useEffect(() => {
    // Try to center the map using the user's geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    // Fetch houses data from your API
    const fetchHouses = async () => {
      try {
        const response = await fetch("/api/houses");
        if (!response.ok) {
          throw new Error("Failed to fetch houses");
        }
        const data = await response.json();
        setHouses(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHouses();
  }, []);

  const getScaledIcon = (iconUrl) => {
    if (typeof window !== "undefined" && window.google && window.google.maps) {
      return {
        url: iconUrl,
        // Adjust the icon's scale as needed
        scale: 4,
      };
    }
    return iconUrl;
  };

  const renderSidebar = () => {
    return (
      <Popup selectedHouse={selectedHouse} setSelectedHouse={setSelectedHouse} />
    );
  };

  // This callback is passed to SearchBar. When a place is selected, update the map center.
  const handlePlaceSelected = (newCenter) => {
    setCenter(newCenter);
  };

  return (
    <div style={{ position: "relative" }}>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        libraries={["places"]}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={16}
          options={mapOptions}
        >
          {/* Example marker */}
          <Marker
            position={{ lat: 53.54992, lng: 10.00678 }}
            icon={getScaledIcon(
              "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png"
            )}
          />
          {houses.map((house, index) => {
            return (
              <div key={index}>
                <Marker
                  position={{
                    lat: Number(house.Latitude),
                    lng: Number(house.Longitude),
                  }}
                  icon={`${house.color}.svg`}
                  onClick={() => setSelectedHouse(house)}
                  onLoad={() => console.log("Marker Loaded")}
                />
              </div>
            );
          })}
        </GoogleMap>
        {/* Render the search bar over the map */}
        <SearchBar onPlaceSelected={handlePlaceSelected} />
      </LoadScript>
      {selectedHouse && renderSidebar()}
    </div>
  );
};

export default Map;