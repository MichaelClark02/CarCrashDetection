import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Callout }from 'react-native-maps';
import * as Location from 'expo-location';
import { FontAwesome5 } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av'
import 'react-native-gesture-handler'
import {MarkerComponent,currVid} from './marker';

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

async function fetchAllData() {
  try {
    const url = "127.0.0.1:8000/videos/";
    const response = await fetch(url); // Replace with the URL of the API you want to fetch data from
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json(); // Parse the response as JSON
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
  return data
}



export default function Map({ navigation }) {
  const allVids = fetchAllData();
  const jsonObject = JSON.parse(allVids);

  jsonObject.forEach((item, index) => {
    <MarkerComponent markerData = {item}>

    </MarkerComponent>
    //make marker
    //title = item.file_id
    //longitude = item.location.lon
    //latitude = item.location.lat
    //extra note = item.upload_date
    //all markers need this flag
    //onPress={currVid = fetchData('item.file_id')}
    //on all video tags the source = currVid

    //ignore
    // console.log(`Object ${index + 1}:`);
    // console.log("ID:", item._id);
    // console.log("File ID:", item.file_id);
    // console.log("Filename:", item.filename);
    // console.log("Location (lat):", item.location.lat);
    // console.log("Location (lon):", item.location.lon);
    // console.log("Upload Date:", item.upload_date);
    // console.log("\n");
  });
  
  
  const video = React.useRef(null);
  const [lat, setLat] = useState(0);
  const [lon, setLong] = useState(0);
  const [status, setStatus] = React.useState({});

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLat(location.coords.latitude);
      setLong(location.coords.longitude);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        followsUserLocation
        mapType="hybrid"
        showsUserLocation
        userLocationPriority="high"
        initialRegion={{
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.0025,
          longitudeDelta: 0.0025,
        }}
      >
        {/* {/* <Marker 
        onPress={fetchData('asdasd')}
        coordinate={{
          latitude: 32.98626276350026,
          longitude: -96.75027303423546
        }} 
        title=id
        //onPress={() => navigation.navigate("Video")}
        >
          <FontAwesome5 name="car-crash" size={32} color="black" style={styles.icon}/>
          <Callout style={styles.vidContainer}>
          
            <Video
            ref={video}
            style={styles.video}
            source={require('../../assets/4secs.mp4')}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay
            //useNativeControls
            isLooping
          />  
           }
          
          

            
            
          </Callout>
          </Marker> */}
      </MapView>
      
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  icon: {
    borderWidth: 1,
    backgroundColor: 'maroon'
  },
  video: {
    width: 350,
    height: 200,
  }
  
});
