import React from 'react';
import { Text } from 'react-native';

export const HomeTextItem = () => {
  return (
    <>
      <Text
        style={{
          color: '#229892',
          fontWeight: '900',
          fontSize: 30,
          fontFamily: 'NotoSansKR-Bold',
          letterSpacing: 0,
          marginBottom: -10,
        }}
      >
        오늘도
      </Text>
      <Text
        style={{
          fontWeight: '900',
          fontSize: 30,
          fontFamily: 'NotoSansKR-Bold',
        }}
      >
        하루를 치열하게
      </Text>
    </>
  );
};
