// App/Components/Home/PlaceItem.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { AntDesign } from "@expo/vector-icons";
import Colors from '../../Shared/Colors'; // Adjust the path according to your project structure

export default function PlaceItem({ place }) {
  return (
    <View style={styles.container}>
      {place?.photos ? (
        <Image
          source={{
            uri:
              "https://maps.googleapis.com/maps/api/place/photo" +
              "?maxwidth=400" +
              "&photo_reference=" +
              place?.photos[0]?.photo_reference +
              "&key=AIzaSyBS7eF0EwWB2PJVGSVm597hfmupug-2M2Q",
          }}
          style={styles.image}
        />
      ) : (
        <Image
          source={require('../../../assets/placeholder.jpg')}
          style={styles.image}
        />
      )}
      <View style={styles.details}>
        <Text numberOfLines={2} style={styles.title}>{place.name}</Text>
        <Text numberOfLines={2} style={styles.address}>{place.vicinity}</Text>
        <View style={styles.ratingContainer}>
          <AntDesign name="star" size={20} color={Colors.YELLOW} />
          <Text>{place.rating}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginTop: 20,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 15,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    marginBottom: 5,
    fontFamily: 'raleway-bold',
  },
  address: {
    fontSize: 16,
    marginBottom: 5,
    color: Colors.DARK_GRAY,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});
