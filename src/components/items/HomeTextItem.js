import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fontPercentage } from 'utils/responsiveUtil';

const GREEN_COLOR = '#2A9C96';

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
    fontSize: fontPercentage(21),
    fontFamily: 'NotoSansKR-Black',
    letterSpacing: 0,
    marginBottom: -3,
  },
  homeHeaderRectangle: {
    position: 'absolute',
    bottom: 0,
    left: -0.1,
    width: 5,
    height: 54,
    backgroundColor: '#00A29A',
    shadowColor: '#00000029',
  },
});
