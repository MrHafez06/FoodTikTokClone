import React, { createContext, useState, useContext, useEffect } from 'react';
import { Audio } from 'expo-av';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);

  const playSound = async (uri) => {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true }
    );
    setSound(newSound);
    setIsPlaying(true);
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const resumeSound = async () => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <AudioContext.Provider
      value={{
        playSound,
        pauseSound,
        resumeSound,
        stopSound,
        isPlaying,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};