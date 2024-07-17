import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import Colors from '../../Shared/Colors';


import * as Location from 'expo-location';

const GOOGLE_PLACES_API_KEY = 'AIzaSyBS7eF0EwWB2PJVGSVm597hfmupug-2M2Q'; // Replace with your API key

export default function PlaceDetails() {
    const route = useRoute();
    const { place } = route.params;

    const [distance, setDistance] = useState(null);
    const [openingHours, setOpeningHours] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            let userLocation = await Location.getCurrentPositionAsync({});
            setUserLocation(userLocation.coords);
        })();
    }, []);

    useEffect(() => {
        if (userLocation) {
            const distanceInMeters = getDistanceFromLatLonInKm(userLocation.latitude, userLocation.longitude, place.geometry.location.lat, place.geometry.location.lng);
            setDistance(distanceInMeters);
        }
    }, [userLocation]);

    useEffect(() => {
        fetchPlaceDetails(place.place_id);
    }, []);

    const fetchPlaceDetails = async (placeId) => {
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_PLACES_API_KEY}`);
            if (response.data.status === 'OK') {
                setOpeningHours(response.data.result.opening_hours.weekday_text || []);
                setReviews(response.data.result.reviews || []);
            } else {
                console.error('Error fetching place details:', response.data.error_message);
            }
        } catch (error) {
            console.error('Error fetching place details:', error);
        }
    };

    const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1); // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    const openInGoogleMaps = () => {
        const url = `https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat},${place.geometry.location.lng}`;
        Linking.openURL(url);
    };

    return (
        <ScrollView style={styles.container}>
            <FlatList
                data={place.photos}
                horizontal
                keyExtractor={(item) => item.photo_reference}
                renderItem={({ item }) => (
                    <Image
                        source={{
                            uri:
                                "https://maps.googleapis.com/maps/api/place/photo" +
                                "?maxwidth=400" +
                                "&photo_reference=" +
                                item.photo_reference +
                                "&key=" + GOOGLE_PLACES_API_KEY,
                        }}
                        style={styles.image}
                    />
                )}
            />
            <Text style={styles.title}>{place.name}</Text>
            <Text style={styles.address}>{place.vicinity}</Text>
            {distance && (
                <Text style={styles.distance}>Distance: {distance.toFixed(2)} km</Text>
            )}
            <Text style={styles.sectionTitle}>Opening Hours</Text>
            {openingHours.length > 0 ? (
                openingHours.map((hour, index) => (
                    <Text key={index} style={styles.text}>{hour}</Text>
                ))
            ) : (
                <Text style={styles.text}>No opening hours available</Text>
            )}
            <Text style={styles.sectionTitle}>Rating: {place.rating}</Text>
            <Text style={styles.sectionTitle}>Google Reviews</Text>
            {reviews.length > 0 ? (
                reviews.map((review, index) => (
                    <View key={index} style={styles.review}>
                        <Text style={styles.reviewAuthor}>{review.author_name}</Text>
                        <Text style={styles.reviewText}>{review.text}</Text>
                    </View>
                ))
            ) : (
                <Text style={styles.text}>No reviews available</Text>
            )}
            <TouchableOpacity style={styles.button} onPress={openInGoogleMaps}>
                <Text style={styles.buttonText}>Open in Google Maps</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    image: {
        width: 340,
        height: 200,
       
        borderRadius:20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    address: {
        fontSize: 18,
        color: Colors.DARK_GRAY,
        marginBottom: 10,
    },
    distance: {
        fontSize: 16,
        color: Colors.GRAY,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    text: {
        fontSize: 16,
        color: Colors.DARK_GRAY,
        marginBottom: 5,
    },
    review: {
        marginBottom: 10,
    },
    reviewAuthor: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    reviewText: {
        fontSize: 16,
        color: Colors.GRAY,
    },
    button: {
        marginTop: 20,
        padding: 15,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});
