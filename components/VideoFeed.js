// components/VideoFeed.js
import React, { useState, useEffect } from 'react';
import { View, FlatList, Dimensions, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RestaurantVideo from './RestaurantVideo';
import { restaurants } from '../data/mockData';

const { height, width } = Dimensions.get('window');

export default function VideoFeed() {
  const [allVideos, setAllVideos] = useState([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const videos = restaurants.flatMap(restaurant => 
      restaurant.videos.map(video => ({
        ...video,
        restaurantName: restaurant.name,
        restaurantId: restaurant.id
      }))
    );
    setAllVideos(videos);
  }, []);

  const renderItem = ({ item }) => (
    <View style={[styles.videoContainer, { height: height - insets.bottom }]}>
      <RestaurantVideo video={item} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={allVideos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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