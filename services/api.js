// services/api.js
import axios from 'axios';

const API_URL = 'http://your-api-url.com/api';

export async function fetchNearbyVideos(latitude, longitude) {
  try {
    const response = await axios.get(`${API_URL}/videos/nearby`, {
      params: { lat: latitude, lon: longitude },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching nearby videos:', error);
    throw error;
  }
}