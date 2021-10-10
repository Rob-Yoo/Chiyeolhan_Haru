import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const GREEN_COLOR = '#229892';

export const HomeTextItem = () => {
  return (
    <>
      <View style={styles.homeHeaderRectangle} />
      <Text style={[styles.homeText, { color: GREEN_COLOR }]}>오늘도</Text>
      <Text style={[styles.homeText]}>하루를 치열하게</Text>
    </>
  );
};

const styles = StyleSheet.create({
  homeText: {
    fontWeight: '900',
    fontSize: 25,
    fontFamily: 'NotoSansKR-Bold',
    letterSpacing: 0,
    marginBottom: -10,
  },
  homeHeaderRectangle: {
    position: 'absolute',
    top: 10,
    left: 0,
    width: 7,
    height: 60,
    backgroundColor: '#00A29A',
    shadowColor: '#00000029',
  },
});
