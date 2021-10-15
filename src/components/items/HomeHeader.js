import React from 'react';

import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { HomeTextItem } from 'components/items/HomeTextItem';

import IconGoToScheduleButton from '#assets/icons/icon-go-to-schedule-button';

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
          style={styles.iconScheduleButton}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  homeHeader: {
    flex: 1.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 50,
  },
  homeHeaderText: { flex: 0.7, paddingLeft: 15 },
});
