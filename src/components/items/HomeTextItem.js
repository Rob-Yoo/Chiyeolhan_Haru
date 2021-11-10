import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fontPercentage } from 'utils/responsiveUtil';
import { SCREEN_HEIGHT } from '../../constant/const';

const GREEN_COLOR = '#2A9C96';

export const HomeTextItem = () => {
  return (
    <>
      <View style={styles.homeHeaderRectangle} />
      <Text style={[styles.homeText, { color: GREEN_COLOR, marginBottom: -3 }]}>
        오늘도
      </Text>
      <Text style={[styles.homeText]}>하루를 치열하게</Text>
    </>
  );
};

const styles = StyleSheet.create({
  homeText: {
    fontSize: fontPercentage(21),
    fontFamily: 'NotoSansKR-Black',
  },
  homeHeaderRectangle: {
    position: 'absolute',
    bottom: 0,
    left: -0.1,
    width: 5,
    height:
      SCREEN_HEIGHT > 668
        ? (51 * SCREEN_HEIGHT) / 812
        : (51 * SCREEN_HEIGHT) / 690,
    backgroundColor: '#229892',
  },
});
