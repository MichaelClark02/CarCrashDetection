import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Callout }from 'react-native-maps';
import * as Location from 'expo-location';
import { FontAwesome5 } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av'
import 'react-native-gesture-handler'



export default function Map({ navigation }) {
  const video = React.useRef(null)
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
        <Marker 
        coordinate={{
          latitude: 32.98626276350026,
          longitude: -96.75027303423546
        }} 
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
          
          
          

            
            
          </Callout>
        </Marker>
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
