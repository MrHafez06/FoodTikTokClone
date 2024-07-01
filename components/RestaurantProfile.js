// components/RestaurantProfile.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { restaurants } from '../data/mockData';
import RestaurantVideo from './RestaurantVideo';

const { width, height } = Dimensions.get('window');

export default function RestaurantProfile({ route }) {
  const { restaurantId } = route.params;
  const restaurant = restaurants.find(r => r.id === restaurantId);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{restaurant.name}</Text>
      <FlatList
        data={restaurant.videos}
        renderItem={({ item }) => (
          <View style={styles.videoContainer}>
            <RestaurantVideo 
              video={{...item, restaurantName: restaurant.name, restaurantId: restaurant.id}}
              isInProfile={true}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        pagingEnabled
        snapToInterval={height - 100} // Adjust this value based on your layout
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    padding: 20,
  },
  videoContainer: {
    height: height - 100, // Adjust this value based on your layout
    width: width,
  },
});