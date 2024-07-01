// components/RestaurantVideo.js
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function RestaurantVideo({ video, isInProfile = false }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.unloadAsync();
      }
    };
  }, []);

  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const goToRestaurantProfile = () => {
    if (!isInProfile) {
      navigation.navigate('RestaurantProfile', { restaurantId: video.restaurantId });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={togglePlayPause}>
      <View style={[styles.container, isInProfile && styles.profileContainer]}>
        <Video
          ref={videoRef}
          source={{ uri: video.url }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay={isPlaying}
          isLooping
          style={styles.video}
        />
        <View style={[styles.infoContainer, { bottom: isInProfile ? 20 : insets.bottom + 20 }]}>
          <Text style={styles.restaurantName}>{video.restaurantName}</Text>
          <Text style={styles.description}>{video.description}</Text>
        </View>
        {!isInProfile && (
          <View style={styles.interactionContainer}>
            <TouchableOpacity style={styles.profileIcon} onPress={goToRestaurantProfile}>
              <Ionicons name="person-circle-outline" size={50} color="white" />
              <Text style={styles.profileText}>Profile</Text>
            </TouchableOpacity>
            {/* Add other interaction buttons here (like, comment, share) */}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  profileContainer: {
    height: height - 100, // Adjust this value based on your layout
  },
  video: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    position: 'absolute',
    left: 10,
    right: 10,
  },
  restaurantName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    color: 'white',
    fontSize: 14,
  },
  interactionContainer: {
    position: 'absolute',
    right: 10,
    bottom: 300, // Adjust this value to move the container up or down
    alignItems: 'center',
  },
  profileIcon: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
});