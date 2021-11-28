import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fontPercentage } from 'utils/responsiveUtil';
import { CONTAINER_WIDTH } from '../../constant/const';

const GREEN_COLOR = '#2A9C96';

export const HomeTextItem = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
      }}
    >
      <View style={styles.homeHeaderRectangle} />
      <View>
        <Text
          style={[styles.homeText, { color: GREEN_COLOR, marginBottom: -3 }]}
        >
          오늘도
        </Text>
        <Text style={[styles.homeText]}>하루를 치열하게</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  homeText: {
    fontSize: fontPercentage(21),
    fontFamily: 'NotoSansKR-Black',
  },
  homeHeaderRectangle: {
    width: CONTAINER_WIDTH * 0.014,
    //width: 5,
    height: '90%',
    backgroundColor: '#229892',
    marginRight: '4%',
  },
});
