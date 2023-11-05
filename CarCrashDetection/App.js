import React, { useState, useEffect} from 'react'
import Map from './src/components/map';
import Vid from './src/components/video';
import { createStackNavigator } from '@react-navigation/stack'; 
import { NavigationContainer } from "@react-navigation/native"


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          //gestureDirection: 'vertical'
        }}
        >
      <Stack.Screen name="Map" component={Map} />
    </Stack.Navigator>
  </NavigationContainer>
  );
}

