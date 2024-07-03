import React, { useState, useEffect } from "react";
import { View, FlatList, Dimensions, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RestaurantVideo from "./RestaurantVideo";
import { fetchRestaurants } from "../services/api";

const { height, width } = Dimensions.get("window");

export default function VideoFeed() {
  const [allVideos, setAllVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const restaurants = await fetchRestaurants();
      const videos = restaurants.flatMap((restaurant) =>
        restaurant.videos.map((video) => ({
          ...video,
          restaurantName: restaurant.name,
          restaurantId: restaurant._id,
          profileIcon: restaurant.profileIcon,
        }))
      );
      setAllVideos(videos);
    } catch (error) {
      console.error("Error loading videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={[styles.videoContainer, { height: height - insets.bottom }]}>
      <RestaurantVideo
        video={item}
        isPlaying={index === currentlyPlayingIndex}
      />
    </View>
  );

  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentlyPlayingIndex(viewableItems[0].index);
    }
  };

  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
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
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  videoContainer: {
    width: width,
  },
  loadingText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});