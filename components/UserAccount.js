import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { getUserLikedVideos } from "../services/api";
import { AuthContext } from "../App";
import tw from '../styles/tailwind';

export default function UserAccount({ navigation }) {
  const [likedVideos, setLikedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userId, setUserId } = useContext(AuthContext);

  useEffect(() => {
    if (userId) {
      loadLikedVideos();
    }
  }, [userId]);

  const loadLikedVideos = async () => {
    try {
      const videos = await getUserLikedVideos(userId);
      setLikedVideos(videos);
    } catch (error) {
      console.error("Error loading liked videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderVideoItem = ({ item }) => (
    <TouchableOpacity
      style={tw`flex-1 m-1`}
      onPress={() => navigation.navigate("VideoPlayer", { video: item })}
    >
      <Image source={{ uri: item.thumbnailUrl }} style={tw`w-full aspect-video rounded-lg`} />
      <Text style={tw`text-white mt-1`}>{item.description}</Text>
    </TouchableOpacity>
  );

  const handleLogout = () => {
    setUserId(null);  // This will trigger the app to show the Auth screen
  };

  if (isLoading) {
    return (
      <View style={tw`flex-1 bg-background justify-center items-center`}>
        <Text style={tw`text-white text-lg`}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-background p-2`}>
      <Text style={tw`text-2xl font-bold text-white mb-5`}>Your Liked Videos</Text>
      <FlatList
        data={likedVideos}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={tw`justify-between`}
      />
      <TouchableOpacity
        style={tw`bg-primary p-4 rounded-lg mt-4`}
        onPress={handleLogout}
      >
        <Text style={tw`text-white text-center font-bold`}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}