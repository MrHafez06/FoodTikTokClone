import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { login, register } from '../services/api';
import { AuthContext } from '../App';
import tw from '../styles/tailwind';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUserId } = useContext(AuthContext);

  const handleSubmit = async () => {
    try {
      let response;
      if (isLogin) {
        response = await login(username, password);
      } else {
        response = await register(username, email, password);
        if (response.message === 'User registered successfully') {
          // After successful registration, log the user in
          response = await login(username, password);
        }
      }
      if (response.token) {
        setUserId(response.userId);
      } else {
        setError(response.message || 'An error occurred');
      }
    } catch (error) {
      setError(error.message || 'An error occurred');
    }
  };

  return (
    <View style={tw`flex-1 justify-center items-center bg-background p-5`}>
      <Text style={tw`text-3xl font-bold mb-8 text-white`}>{isLogin ? 'Login' : 'Register'}</Text>
      {error ? <Text style={tw`text-red-500 mb-4`}>{error}</Text> : null}
      <TextInput
        style={tw`w-full bg-gray-700 text-white rounded-lg p-3 mb-4`}
        placeholder="Username"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
      />
      {!isLogin && (
        <TextInput
          style={tw`w-full bg-gray-700 text-white rounded-lg p-3 mb-4`}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
        />
      )}
      <TextInput
        style={tw`w-full bg-gray-700 text-white rounded-lg p-3 mb-4`}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={tw`w-full bg-primary rounded-lg p-3 items-center`}
        onPress={handleSubmit}
      >
        <Text style={tw`text-white font-bold`}>{isLogin ? 'Login' : 'Register'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={tw`mt-4`}>
        <Text style={tw`text-primary`}>
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}