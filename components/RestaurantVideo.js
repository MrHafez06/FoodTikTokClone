import React, { useEffect, useRef, useState, useContext, forwardRef, useImperativeHandle } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Video } from "expo-av";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { likeVideo, unlikeVideo } from "../services/api";
import { AuthContext } from "../App";
import tw from '../styles/tailwind';

const RestaurantVideo = forwardRef(({
  video,
  isInProfile = false,
  isPlaying,
}, ref) => {
  const [isLiked, setIsLiked] = useState(false);
  const videoRef = useRef(null);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { userId } = useContext(AuthContext);

  useImperativeHandle(ref, () => ({
    stopAsync: () => videoRef.current?.stopAsync(),
  }));

  useEffect(() => {
    if (isPlaying) {
      videoRef.current?.playAsync();
    } else {
      videoRef.current?.stopAsync();
    }
  }, [isPlaying]);

  const handleLike = async () => {
    if (!userId) {
      Alert.alert("Login Required", "Please log in to like videos.");
      return;
    }
    try {
      if (isLiked) {
        console.log('Attempting to unlike video:', video._id);
        await unlikeVideo(video._id, userId);
        console.log('Video unliked successfully');
      } else {
        console.log('Attempting to like video:', video._id);
        await likeVideo(video._id, userId);
        console.log('Video liked successfully');
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error liking/unliking video:", error);
      console.error("Error details:", error.response?.data);
      Alert.alert("Error", `Failed to ${isLiked ? 'unlike' : 'like'} video. ${error.message}`);
    }
  };

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
      navigation.navigate("RestaurantProfile", {
        restaurantId: video.restaurantId,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={togglePlayPause}>
      <View style={tw`flex-1 bg-black`}>
        <Video
          ref={videoRef}
          source={{ uri: video.url }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay={isPlaying}
          isLooping
          style={tw`w-full h-full`}
        />
        <View style={tw`absolute left-2 right-2 bottom-${isInProfile ? '5' : `[${insets.bottom + 20}px]`} p-4`}>
          <TouchableOpacity onPress={goToRestaurantProfile} style={tw`mb-2`}>
            <Image source={{ uri: video.profileIcon }} style={tw`w-10 h-10 rounded-full`} />
          </TouchableOpacity>
          <Text style={tw`text-white text-base font-bold mb-1`}>{video.restaurantName}</Text>
          <Text style={tw`text-white text-sm`}>{video.description}</Text>
        </View>
        <TouchableOpacity style={tw`absolute right-2 bottom-40`} onPress={handleLike}>
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={30}
            color={isLiked ? "red" : "white"}
          />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
});

export default RestaurantVideo;