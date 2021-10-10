import React from 'react';
import { View, Text } from 'react-native';
import { CONTAINER_WIDTH } from 'react-native-week-view/src/utils';

export const AlertView = () => {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        width: CONTAINER_WIDTH,
        height: 300,
        position: 'absolute',
        right: 0,
        top: 30,
        borderRadius: 10,
        padding: 20,
        borderWidth: 0.5,
      }}
    >
      <Text
        style={{
          fontFamily: 'GodoB',
          color: '#229892',
          fontSize: 25,
          marginBottom: 10,
        }}
      >
        주의
      </Text>
      <Text style={{ fontFamily: 'GodoB', color: '#788382', fontSize: 15 }}>
        안내사항이 들어감
      </Text>
    </View>
  );
};
