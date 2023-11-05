// src/components/Map.js
import React from 'react';
import { Data, GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

async function fetchData(id) {
  try {
    const url = "http://127.0.0.1:8000/watch/" + id 
    const response = await fetch(url); // Replace with the URL of the API you want to fetch data from
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json(); // Parse the response as JSON
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function fetchAllData() {
  try {
    const url = "http://127.0.0.1:8000/videos/";
    const response = await fetch(url); // Replace with the URL of the API you want to fetch data from
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json(); // Parse the response as JSON
    console.log(data);
    return data
  } catch (error) {
    console.error('Error:', error);
  }

}


const Map = ({ apiKey }) => {
  const defaultCenter = { lat: 51.505, lng: -0.09 };
  fetchAllData()
  .then(data => {
    // You can work with the JSON data directly here
    console.log(data);
  })
  .catch(error => {
    // Handle any errors that occur during the fetch
    console.error('Error:', error);
  });

  

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={{ height: '400px', width: '100%' }}
        center={defaultCenter}
        zoom={13}
      >
        <Marker position={defaultCenter} />
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
