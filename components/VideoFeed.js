import React, { useState, useEffect, useRef } from "react";
import { View, FlatList, Dimensions } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RestaurantVideo from "./RestaurantVideo";
import { fetchRestaurants } from "../services/api";
import tw from '../styles/tailwind';

const { height, width } = Dimensions.get("window");

export default function VideoFeed() {
  const [allVideos, setAllVideos] = useState([]);
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);

  // Estimate the height of the bottom tab bar
  const tabBarHeight = 49; // This is an estimate, adjust if necessary

  useEffect(() => {
    loadVideos();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setCurrentlyPlayingIndex(0);
      return () => {
        setCurrentlyPlayingIndex(-1);
      };
    }, [])
  );

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
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={[tw`w-full`, { height: height - tabBarHeight }]}>
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

  return (
    <View style={tw`flex-1 bg-black`}>
      <FlatList
        ref={flatListRef}
        data={allVideos}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        pagingEnabled
        snapToInterval={height - tabBarHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
}