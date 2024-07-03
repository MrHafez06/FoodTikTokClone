import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity, Linking } from 'react-native';
import { fetchRestaurantDetails } from '../services/api';
import RestaurantVideo from './RestaurantVideo';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function RestaurantProfile({ route, navigation }) {
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
      <Image 
        source={{ uri: item.thumbnailUrl + '?quality=100' }} 
        style={styles.thumbnailImage} 
      />
    </TouchableOpacity>
  );

  if (isLoading) {
    return <View style={styles.container}><Text style={styles.loadingText}>Loading...</Text></View>;
  }

  if (!restaurant) {
    return <View style={styles.container}><Text style={styles.errorText}>Restaurant not found</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      {selectedVideo ? (
        <View style={styles.fullScreenVideo}>
          <RestaurantVideo video={selectedVideo} isInProfile={true} isPlaying={true} />
          <TouchableOpacity onPress={() => setSelectedVideo(null)} style={styles.closeButton}>
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Image source={{ uri: restaurant.profileIcon }} style={styles.profileIcon} />
            <Text style={styles.title}>{restaurant.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.orderButton}
            onPress={() => Linking.openURL('https://example.com/order')}
          >
            <Text style={styles.orderButtonText}>Order Now</Text>
          </TouchableOpacity>
          <FlatList
            data={restaurant.videos}
            renderItem={renderVideoThumbnail}
            keyExtractor={(item) => item._id}
            numColumns={3}
            contentContainerStyle={styles.videoGrid}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1E1E1E',
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
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  orderButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  videoGrid: {
    padding: 5,
  },
  thumbnail: {
    width: (width - 30) / 3,
    aspectRatio: 9 / 16,
    margin: 5,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  fullScreenVideo: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});