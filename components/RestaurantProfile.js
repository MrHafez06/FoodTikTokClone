import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, FlatList, SafeAreaView, Dimensions, TouchableOpacity, Linking } from 'react-native';
import { fetchRestaurantDetails } from '../services/api';
import RestaurantVideo from './RestaurantVideo';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import tw from '../styles/tailwind';

const { width } = Dimensions.get('window');
const THUMBNAIL_SIZE = (width - 40) / 3;

export default function RestaurantProfile({ route, navigation }) {
  const { restaurantId } = route.params;
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    loadRestaurantDetails();
    stopAllAudio();
    return () => {
      if (videoRef.current) {
        videoRef.current.stopAsync();
      }
    };
  }, [restaurantId]);

  const stopAllAudio = async () => {
    try {
      await Audio.setIsEnabledAsync(false);
      await Audio.setIsEnabledAsync(true);
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  };

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
    <TouchableOpacity 
      onPress={() => setSelectedVideo(item)} 
      style={tw`w-[${THUMBNAIL_SIZE}px] h-[${THUMBNAIL_SIZE}px] m-1`}
    >
      <Image 
        source={{ uri: item.thumbnailUrl }} 
        style={tw`w-full h-full rounded-lg`} 
      />
    </TouchableOpacity>
  );

  const handleCloseVideo = () => {
    if (videoRef.current) {
      videoRef.current.stopAsync();
    }
    setSelectedVideo(null);
  };

  if (isLoading) {
    return <View style={tw`flex-1 bg-background justify-center items-center`}><Text style={tw`text-white text-lg`}>Loading...</Text></View>;
  }

  if (!restaurant) {
    return <View style={tw`flex-1 bg-background justify-center items-center`}><Text style={tw`text-red-500 text-lg`}>Restaurant not found</Text></View>;
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-background`}>
      {selectedVideo ? (
        <View style={tw`absolute inset-0 bg-black`}>
          <RestaurantVideo 
            ref={videoRef}
            video={selectedVideo} 
            isInProfile={true} 
            isPlaying={true} 
          />
          <TouchableOpacity onPress={handleCloseVideo} style={tw`absolute top-10 right-5 bg-black bg-opacity-50 p-2 rounded-full`}>
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={tw`flex-row items-center p-5 bg-secondary`}>
            <Image source={{ uri: restaurant.profileIcon }} style={tw`w-20 h-20 rounded-full mr-5`} />
            <View>
              <Text style={tw`text-2xl font-bold text-white`}>{restaurant.name}</Text>
              <Text style={tw`text-white mt-1`}>{restaurant.description}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={tw`bg-primary p-4 mx-5 my-5 rounded-lg items-center`}
            onPress={() => Linking.openURL('https://example.com/order')}
          >
            <Text style={tw`text-white text-lg font-bold`}>Order Now</Text>
          </TouchableOpacity>
          <FlatList
            data={restaurant.videos}
            renderItem={renderVideoThumbnail}
            keyExtractor={(item) => item._id}
            numColumns={3}
            contentContainerStyle={tw`p-2`}
          />
        </>
      )}
    </SafeAreaView>
  );
}