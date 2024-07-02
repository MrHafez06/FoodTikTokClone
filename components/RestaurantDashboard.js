import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchRestaurants } from '../services/api';
import axios from 'axios';

export default function RestaurantDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [newVideo, setNewVideo] = useState({ url: '', description: '' });
  const [isLoading, setIsLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const data = await fetchRestaurants();
      setRestaurants(data);
    } catch (error) {
      console.error('Error loading restaurants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addVideo = async () => {
    if (selectedRestaurant && newVideo.url && newVideo.description) {
      try {
        const response = await axios.post(`https://tiktokfoodapp.herokuapp.com/api/restaurants/${selectedRestaurant._id}/addVideo`, {
          url: newVideo.url,
          description: newVideo.description
        });
        console.log('Video added:', response.data);
        setNewVideo({ url: '', description: '' });
        loadRestaurants(); // Reload the restaurants to get the updated data
      } catch (error) {
        console.error('Error adding video:', error);
      }
    }
  };

  if (isLoading) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Restaurant Dashboard</Text>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Button
            title={item.name}
            onPress={() => setSelectedRestaurant(item)}
          />
        )}
      />
      {selectedRestaurant && (
        <View style={styles.videoForm}>
          <Text style={styles.subtitle}>{selectedRestaurant.name}</Text>
          <TextInput
            style={styles.input}
            placeholder="Video URL"
            value={newVideo.url}
            onChangeText={(text) => setNewVideo({ ...newVideo, url: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Video Description"
            value={newVideo.description}
            onChangeText={(text) => setNewVideo({ ...newVideo, description: text })}
          />
          <Button title="Add Video" onPress={addVideo} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  videoForm: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
});