import React from 'react';

import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { HomeTextItem } from 'components/items/HomeTextItem';

import IconGoToScheduleButton from '#assets/icons/icon-go-to-schedule-button';
import PixelRatio from 'react-native/Libraries/Utilities/PixelRatio';

export const HomeHeader = ({ navigation }) => {
  const goToScheduleToday = () => navigation.navigate('ScheduleToday');
  return (
    <View style={styles.homeHeader}>
      <View style={styles.homeHeaderText}>
        <HomeTextItem />
      </View>
      <TouchableOpacity>
        <IconGoToScheduleButton
          name="icon-go-to-schedule-button"
          size={35}
          color={'#229892'}
          onPress={goToScheduleToday}
          // style={styles.iconScheduleButton}
        />
      </TouchableOpacity>
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
  homeHeaderText: { flex: 0.7, paddingLeft: 15, marginLeft: -1, marginTop: 4 },
});
