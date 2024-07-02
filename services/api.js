import axios from 'axios';

const API_URL = __DEV__ 
  ? 'http://localhost:5001/api'  // Use this for iOS simulator
  : 'https://tiktokfoodapp.herokuapp.com/api';  // Use this for production

console.log('Using API URL:', API_URL);

export async function fetchRestaurants() {
  console.log('Fetching restaurants from:', `${API_URL}/restaurants`);
  try {
    const response = await axios.get(`${API_URL}/restaurants`);
    console.log('Restaurants response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching restaurants:', error.response ? error.response.data : error.message);
    throw error;
  }
}

export async function fetchRestaurantDetails(id) {
  console.log('Fetching restaurant details from:', `${API_URL}/restaurants/${id}`);
  try {
    const response = await axios.get(`${API_URL}/restaurants/${id}`);
    console.log('Restaurant details response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching restaurant details:', error.response ? error.response.data : error.message);
    throw error;
  }
}