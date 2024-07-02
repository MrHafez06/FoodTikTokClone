import React, { useState, useEffect } from 'react';
import { View, FlatList, Dimensions, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RestaurantVideo from './RestaurantVideo';
import { fetchRestaurants } from '../services/api';

const { height, width } = Dimensions.get('window');

export default function VideoFeed() {
  const [allVideos, setAllVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const restaurants = await fetchRestaurants();
      const videos = restaurants.flatMap(restaurant =>
        restaurant.videos.map(video => ({
          ...video,
          restaurantName: restaurant.name,
          restaurantId: restaurant._id,
          profileIcon: restaurant.profileIcon
        }))
      );
      setAllVideos(videos);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.videoContainer, { height: height - insets.bottom }]}>
      <RestaurantVideo video={item} />
    </View>
  );

  if (isLoading) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={allVideos}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        pagingEnabled
        snapToInterval={height - insets.bottom}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  videoContainer: {
    width: width,
  },
});