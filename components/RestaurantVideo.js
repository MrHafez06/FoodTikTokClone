import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableOpacity, Image } from 'react-native';
import { Video } from 'expo-av';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function RestaurantVideo({ video, isInProfile = false, isPlaying }) {
  const videoRef = useRef(null);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current) {
        if (isPlaying) {
          await videoRef.current.playAsync();
        } else {
          await videoRef.current.stopAsync();
        }
      }
    };
    playVideo();
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.unloadAsync();
      }
    };
  }, []);

  const togglePlayPause = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      if (status.isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
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
          <TouchableOpacity onPress={goToRestaurantProfile} style={styles.profileIconContainer}>
            <Image source={{ uri: video.profileIcon }} style={styles.profileIcon} />
          </TouchableOpacity>
          <Text style={styles.restaurantName}>{video.restaurantName}</Text>
          <Text style={styles.description}>{video.description}</Text>
        </View>
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
    height: height - 100,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 20,
    alignItems: 'flex-start',
  },
  profileIconContainer: {
    marginBottom: 10,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  restaurantName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    color: 'white',
    fontSize: 14,
  },
});