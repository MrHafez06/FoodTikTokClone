import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { getUserLikedVideos } from "../services/api";
import { AuthContext } from "../App"; // Import AuthContext

export default function UserAccount({ navigation }) {
  const [likedVideos, setLikedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useContext(AuthContext); // Use AuthContext to get userId

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
      style={styles.videoItem}
      onPress={() => navigation.navigate("VideoPlayer", { video: item })}
    >
      <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
      <Text style={styles.videoTitle}>{item.description}</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Liked Videos</Text>
      <FlatList
        data={likedVideos}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  videoItem: {
    flex: 1,
    margin: 5,
  },
  thumbnail: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 10,
  },
  videoTitle: {
    color: "white",
    marginTop: 5,
  },
});
