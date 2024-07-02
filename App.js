import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import VideoFeed from './components/VideoFeed';
import RestaurantDashboard from './components/RestaurantDashboard';
import RestaurantProfile from './components/RestaurantProfile';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeTabs} />
          <Stack.Screen name="RestaurantProfile" component={RestaurantProfile} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}