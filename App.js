// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './App/Components/Home/Home';
import PlaceDetails from './App/Components/Home/PlaceDetails';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="PlaceDetails" component={PlaceDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
