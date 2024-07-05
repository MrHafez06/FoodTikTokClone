import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import VideoFeed from './components/VideoFeed';
import RestaurantProfile from './components/RestaurantProfile';
import UserAccount from './components/UserAccount';
import Auth from './components/Auth';
import tw from './styles/tailwind';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export const AuthContext = React.createContext();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: tw`bg-secondary`,
        tabBarActiveTintColor: tw.color('primary'),
        tabBarInactiveTintColor: tw.color('gray-500'),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'NearbyVideos') {
            iconName = focused ? 'play-circle' : 'play-circle-outline';
          } else if (route.name === 'UserAccount') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="NearbyVideos" component={VideoFeed} />
      <Tab.Screen name="UserAccount" component={UserAccount} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [userId, setUserId] = useState(null);

  return (
    <AuthContext.Provider value={{ userId, setUserId }}>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {userId ? (
            <>
              <Stack.Screen name="Home" component={HomeTabs} />
              <Stack.Screen name="RestaurantProfile" component={RestaurantProfile} />
            </>
          ) : (
            <Stack.Screen name="Auth" component={Auth} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}