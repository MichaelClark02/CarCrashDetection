import React from "react";
import { View, Text, StyleSheet } from 'react-native'
import { Video, ResizeMode } from 'expo-av'


export default function Vid({ navigation }) {
  const video = React.useRef(null)
  return(
    <View> 
    <Video
            ref={video}
            source={require('../../assets/4secs.mp4')}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            useNativeControls
            isLooping
            style={styles.video}
          />
    </View>
  )
}

const styles = StyleSheet.create({
  video: {
    flex: 1,
    width: 400,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  }
  
});
