// App/Components/Home/Home.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import PlaceItem from './PlaceItem';
import HorizontalCarousel from './HorizontalCarousel';
import Colors from '../../Shared/Colors';

const GOOGLE_PLACES_API_KEY = 'Your_API_Key';
const BASE_URL = 'https://maps.googleapis.com/maps/api/place';

const Home = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [supermarkets, setSupermarkets] = useState([]);
  const [gasStations, setGasStations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
    })();
  }, []);

  useEffect(() => {
    if (location) {
      fetchNearbyPlaces(location.latitude, location.longitude);
      fetchSupermarkets(location.latitude, location.longitude);
      fetchGasStations(location.latitude, location.longitude);
    }
  }, [location]);

  const fetchNearbyPlaces = async (lat, lng) => {
    try {
      const response = await axios.get(`${BASE_URL}/nearbysearch/json?location=${lat},${lng}&radius=1500&type=restaurant&key=${GOOGLE_PLACES_API_KEY}`);
      if (response.data.status === 'OK') {
        console.log('Nearby Places:', response.data.results);
        setPlaces(response.data.results);
      } else {
        console.error('Error fetching nearby places:', response.data.error_message);
      }
    } catch (error) {
      console.error('Error fetching nearby places:', error);
    }
  };

  const fetchSupermarkets = async (lat, lng) => {
    try {
      const response = await axios.get(`${BASE_URL}/nearbysearch/json?location=${lat},${lng}&radius=1500&type=supermarket&key=${GOOGLE_PLACES_API_KEY}`);
      if (response.data.status === 'OK') {
        console.log('Supermarkets:', response.data.results);
        setSupermarkets(response.data.results);
      } else {
        console.error('Error fetching supermarkets:', response.data.error_message);
      }
    } catch (error) {
      console.error('Error fetching supermarkets:', error);
    }
  };

  const fetchGasStations = async (lat, lng) => {
    try {
      const response = await axios.get(`${BASE_URL}/nearbysearch/json?location=${lat},${lng}&radius=1500&type=gas_station&key=${GOOGLE_PLACES_API_KEY}`);
      if (response.data.status === 'OK') {
        console.log('Gas Stations:', response.data.results);
        setGasStations(response.data.results);
      } else {
        console.error('Error fetching gas stations:', response.data.error_message);
      }
    } catch (error) {
      console.error('Error fetching gas stations:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/textsearch/json?query=${searchQuery}&key=${GOOGLE_PLACES_API_KEY}`);
      if (response.data.status === 'OK') {
        console.log('Search Results:', response.data.results);
        setPlaces(response.data.results);
      } else {
        console.error('Error fetching search results:', response.data.error_message);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      
       <Text style={styles.sectionTitle}>Supermarkets</Text>
      <HorizontalCarousel data={supermarkets} navigation={navigation} />
      <Text style={styles.sectionTitle}>Gas Stations</Text>
      <HorizontalCarousel data={gasStations} navigation={navigation} />
      <Text style={styles.sectionTitle}>Nearby Places</Text>
      <FlatList
        data={places}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('PlaceDetails', { place: item })}>
            <PlaceItem place={item} />
          </TouchableOpacity>
        )}
      />
     <Text style={styles.space}></Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  space:{
    height:60,
  }
});

export default Home;
