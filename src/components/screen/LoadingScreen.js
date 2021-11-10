import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../constant/const';

export const Loading = () => {
  return (
    <View
      style={{
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator size="large" color="#229892" />
    </View>
  );
};
