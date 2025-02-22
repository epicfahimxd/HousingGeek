"use client";
import React, {useState, useEffect} from "react";
import { GoogleMap, LoadScript, Marker, Circle } from "@react-google-maps/api";
import SearchBar from "./SearchBar";

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
            stylers: [{ visibility: "off" }]
        }
    ]
}

const Map = () => {
    const [center, setCenter] = useState({lat: 42.4085, lng: -71.1183});

    useEffect(() => {
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
    }, []);
    
    const getScaledIcon = (iconUrl) => {
        if (typeof window !== "undefined" && window.google && window.google.maps) {
            return { 
                url: iconUrl, 
                // adjust the width and height (in pixels) as needed
                scale: 4
            };
        }
        return iconUrl;
    };

    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}> {/* Replace with your API key */}
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={16} options={mapOptions}>
                {/*we are going to want to replace these with calls to get saved markers!*/}
                <Marker position={center} onLoad={() => console.log('Marker Loaded')} icon={getScaledIcon("https://i.redd.it/tbbx5iv4dri41.jpg")} />
                <Marker position={{lat: 53.54992, lng: 10.00678} }icon={getScaledIcon("https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png")}/>
                <Circle
                  center={center}
                  radius={1000}
                  options={{
                    strokeColor: "#ff0000",
                    fillColor: "#ff0000"
                  }}
                />
                {/* When we are at a certain radius we want to only display the hotmap,
                    When we get closer (1-2 mile radius we show the pins)
                */}

            </GoogleMap>
        </LoadScript>
    );
};

export default Map;