// App/Components/Home/HorizontalCarousel.js
import React from 'react';
import { View, FlatList, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const GOOGLE_PLACES_API_KEY = 'AIzaSyBS7eF0EwWB2PJVGSVm597hfmupug-2M2Q';

export default function HorizontalCarousel({ data }) {
  const navigation = useNavigation();

  const renderItem = ({ item }) => {
    const imageUrl = item.photos && item.photos[0] && item.photos[0].photo_reference
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${item.photos[0].photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
      : require('../../../assets/placeholder.jpg');

    return (
      <TouchableOpacity onPress={() => navigation.navigate('PlaceDetails', { place: item })}>
        <View style={styles.itemContainer}>
          {typeof imageUrl === 'string' ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              onError={(e) => console.error(e.nativeEvent.error)}
            />
          ) : (
            <Image
              source={imageUrl}
              style={styles.image}
              onError={(e) => console.error(e.nativeEvent.error)}
            />
          )}
          <Text style={styles.name}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(item) => item.place_id}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    marginRight: 10,
  },
  image: {
    width: 210,
    height: 120,
    borderRadius: 8,
  },
  name: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
