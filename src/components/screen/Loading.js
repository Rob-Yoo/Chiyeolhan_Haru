import React from 'react';
import { ImageBackground } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'constant/const';

export const Loading = () => {
  return (
    <ImageBackground
      style={[{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }]}
      source={{ uri: 'SplashScreen' }}
    />
  );
};
