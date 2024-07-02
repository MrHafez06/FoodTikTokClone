import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { fetchRestaurantDetails } from '../services/api';
import RestaurantVideo from './RestaurantVideo';

const { width, height } = Dimensions.get('window');

export default function RestaurantProfile({ route }) {
  const { restaurantId } = route.params;
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRestaurantDetails();
  }, [restaurantId]);

  const loadRestaurantDetails = async () => {
    try {
      const data = await fetchRestaurantDetails(restaurantId);
      setRestaurant(data);
    } catch (error) {
      console.error('Error loading restaurant details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  if (!restaurant) {
    return <View style={styles.container}><Text>Restaurant not found</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: restaurant.profileIcon }} style={styles.profileIcon} />
        <Text style={styles.title}>{restaurant.name}</Text>
      </View>
      <FlatList
        data={restaurant.videos}
        renderItem={({ item }) => (
          <View style={styles.videoContainer}>
            <RestaurantVideo
              video={{...item, restaurantName: restaurant.name, restaurantId: restaurant._id}}
              isInProfile={true}
            />
          </View>
        )}
        keyExtractor={(item) => item._id}
        pagingEnabled
        snapToInterval={height - 100}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  videoContainer: {
    height: height - 100,
    width: width,
  },
});