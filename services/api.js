import axios from 'axios';

const API_URL = 'https://tiktokfoodapp-a36506d95ff8.herokuapp.com/api';

const api = axios.create({
  baseURL: API_URL,
});

export const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const fetchRestaurants = async () => {
  const response = await api.get('/restaurants');
  return response.data;
};

export const fetchRestaurantDetails = async (id) => {
  const response = await api.get(`/restaurants/${id}`);
  return response.data;
};

export const likeVideo = async (videoId, userId) => {
  try {
    const response = await api.post(`/restaurants/${videoId}/like`, { userId });
    return response.data;
  } catch (error) {
    console.error('Like video error:', error.response?.data || error.message);
    throw error;
  }
};

export const unlikeVideo = async (videoId, userId) => {
  try {
    const response = await api.post(`/restaurants/${videoId}/unlike`, { userId });
    return response.data;
  } catch (error) {
    console.error('Unlike video error:', error.response?.data || error.message);
    throw error;
  }
};

export const getUserLikedVideos = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/liked-videos`);
    return response.data;
  } catch (error) {
    console.error('Error fetching liked videos:', error);
    throw error;
  }
};

export default api;