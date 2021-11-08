import React from 'react';

import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { HomeTextItem } from 'components/items/HomeTextItem';

import IconGoToScheduleButton from '#assets/icons/icon-go-to-schedule-button';
import { SCREEN_HEIGHT } from 'constant/const';

export const HomeHeader = ({ navigation }) => {
  const goToScheduleToday = () => navigation.navigate('ScheduleToday');
  return (
    <View style={styles.homeHeader}>
      <View style={styles.homeHeaderText}>
        <HomeTextItem />
      </View>
      <View
        style={{
          height: '25%',
          justifyContent: 'flex-end',
          marginTop: 19,
        }}
      >
        <TouchableOpacity
          style={{
            width: 50,
            height: 50,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
          }}
        >
          <IconGoToScheduleButton
            name="icon-go-to-schedule-button"
            size={SCREEN_HEIGHT > 668 ? 32 : 35}
            color={'#229892'}
            onPress={goToScheduleToday}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  homeHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  homeHeaderText: {
    flex: 0.7,
    paddingLeft: 15,
    marginLeft: 0,
    marginTop: 19,
  },
});
