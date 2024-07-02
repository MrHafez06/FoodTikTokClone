import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity, Linking } from 'react-native';
import { fetchRestaurantDetails } from '../services/api';
import RestaurantVideo from './RestaurantVideo';

const { width, height } = Dimensions.get('window');

export default function RestaurantProfile({ route }) {
  const { restaurantId } = route.params;
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

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

  const renderVideoThumbnail = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedVideo(item)} style={styles.thumbnail}>
      <Image source={{ uri: item.thumbnailUrl || item.url }} style={styles.thumbnailImage} />
    </TouchableOpacity>
  );

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
      <TouchableOpacity
        style={styles.orderButton}
        onPress={() => Linking.openURL('https://example.com/order')} // Replace with actual order URL
      >
        <Text style={styles.orderButtonText}>Order Now</Text>
      </TouchableOpacity>
      {selectedVideo ? (
        <View style={styles.videoContainer}>
          <RestaurantVideo video={selectedVideo} isInProfile={true} />
          <TouchableOpacity onPress={() => setSelectedVideo(null)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={restaurant.videos}
          renderItem={renderVideoThumbnail}
          keyExtractor={(item) => item._id}
          numColumns={3}
          contentContainerStyle={styles.videoGrid}
        />
      )}
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
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  orderButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    margin: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  orderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  videoGrid: {
    padding: 5,
  },
  thumbnail: {
    width: (width - 30) / 3,
    height: (width - 30) / 3,
    margin: 5,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  videoContainer: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});