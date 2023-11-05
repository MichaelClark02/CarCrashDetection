import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Callout }from 'react-native-maps';
import * as Location from 'expo-location';
import { FontAwesome5 } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av'
import 'react-native-gesture-handler'


async function fetchData(id) {
    try {
      const url = "127.0.0.1:8000/watch/" + id 
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

export let currVid

const MarkerComponent = ({ markerData }) => {
   
  return (
    <MapView
      style={{ flex: 1 }}

    >
      {markerData.map((marker, index) => (
        
        <Marker
          onPress={currVid = fetchData(item.file_id)}
          key={marker.file_id}
          coordinate={{
            latitude: marker.location.lat,
            longitude: marker.location.lon
          }}
          title={marker.file_id}
          description={marker.upload_date}
        >
          {/* You can customize the marker's view here */}
          <View
            style={{
              backgroundColor: 'blue',
              padding: 5,
              borderRadius: 5,
            }}
          >
             <FontAwesome5 name="car-crash" size={32} color="black" style={styles.icon}/>
          <Callout style={styles.vidContainer}>
          
            <Video
            ref={video}
            style={styles.video}
            source={require(currVid)}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay
            //useNativeControls
            isLooping
          />            
          </Callout>
            <Text style={{ color: 'white' }}>{marker.title}</Text>
          </View>
        </Marker>
      ))}
    </MapView>
  );
};

export default MarkerComponent;
