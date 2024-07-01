// components/RestaurantDashboard.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { restaurants } from '../data/mockData';

export default function RestaurantDashboard() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [newVideo, setNewVideo] = useState({ url: '', description: '' });
  const insets = useSafeAreaInsets();

  const addVideo = () => {
    if (selectedRestaurant && newVideo.url && newVideo.description) {
      // Add video logic here
      setNewVideo({ url: '', description: '' });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Restaurant Dashboard</Text>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
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