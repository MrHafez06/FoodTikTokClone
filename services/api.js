import axios from "axios";

const API_URL = "https://tiktokfoodapp-a36506d95ff8.herokuapp.com/api/restaurants"; // Use this for production

console.log("Using API URL:", API_URL);

export async function fetchRestaurants() {
  console.log("Fetching restaurants from:", `${API_URL}`);
  try {
    const response = await axios.get(`${API_URL}`);
    console.log("Restaurants response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching restaurants:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

export async function fetchRestaurantDetails(id) {
  console.log(
    "Fetching restaurant details from:",
    `${API_URL}/restaurants/${id}`
  );
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    console.log("Restaurant details response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching restaurant details:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}
