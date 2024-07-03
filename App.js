import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import VideoFeed from './components/VideoFeed';
import RestaurantDashboard from './components/RestaurantDashboard';
import RestaurantProfile from './components/RestaurantProfile';
import UserAccount from './components/UserAccount';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Create a simple authentication context
export const AuthContext = React.createContext();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: 'black' },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="NearbyVideos" component={VideoFeed} />
      <Tab.Screen name="RestaurantDashboard" component={RestaurantDashboard} />
      <Tab.Screen name="UserAccount" component={UserAccount} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [userId, setUserId] = useState('dummyUserId'); // Replace with actual authentication logic

  return (
    <AuthContext.Provider value={{ userId, setUserId }}>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeTabs} />
          <Stack.Screen name="RestaurantProfile" component={RestaurantProfile} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}