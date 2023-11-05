// src/components/Map.js
import React, { useEffect, useState } from "react";
import { Data, GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

async function fetchData(id) {
  try {
    const url = "http://127.0.0.1:8000/watch/" + id;
    const response = await fetch(url); // Replace with the URL of the API you want to fetch data from
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json(); // Parse the response as JSON
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchAllData() {
  try {
    const url = "http://127.0.0.1:8000/videos/";
    const response = await fetch(url); // Replace with the URL of the API you want to fetch data from
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json(); // Parse the response as JSON
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

const defaultCenter = { lat: 33.00382358994163, lng: -96.70807521810619 };

const handleVideo = (e, fileName) => {
  const videoUrl = `http://127.0.0.1:8000/watch/${fileName}`;
  const newWindow = window.open("http://127.0.0.1:8000/watch/" + fileName);
};

const Map = ({ apiKey }) => {
  const [markers, setMarkers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData()
      .then((data) => {
        if (data) {
          const newMarkers = data.map((item) => ({
            lat: Number(item.location.lat),
            lng: Number(item.location.lon),
            id: item.file_id,
            filename: item.filename,
            uploadDate: item.upload_date,
          }));
          setMarkers(newMarkers);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(error.message);
      });
  }, []);

  if (error) {
    return <div>Error loading markers: {error}</div>;
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={{ height: "400px", width: "100%" }}
        center={defaultCenter}
        zoom={13}
      >
        {markers.map((marker) => (
          <Marker
            onClick={(e) => handleVideo(e, marker.filename)}
            key={marker.id}
            position={{
              lat: marker.lat,
              lng: marker.lng,
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
