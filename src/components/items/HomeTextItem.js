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
    fontSize: 22,
    fontFamily: 'NotoSansKR-Black',
    letterSpacing: 0,
    marginBottom: -5,
  },
  homeHeaderRectangle: {
    position: 'absolute',
    top: 3,
    left: 2,
    width: 5,
    height: 55,
    backgroundColor: '#00A29A',
    shadowColor: '#00000029',
  },
});
