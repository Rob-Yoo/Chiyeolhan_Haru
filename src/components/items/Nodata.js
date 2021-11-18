import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import IconTaskToDoman from '#assets/icons/icon-todo-man';
import IconArrow from '#assets/icons/icon-arrow';

import { SCREEN_HEIGHT, SCREEN_WIDTH, ratio } from 'constant/const';

export const Nodata = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.wrap}>
      <View style={styles.background} />
      <View style={styles.backgroundWhite}>
        <View style={styles.noDataCard}>
          <View style={styles.circle}>
            <IconTaskToDoman name="icon-todo-man" size={20} color="#229892" />
          </View>
          <Text style={styles.cardText}>치열한 하루!</Text>
          <View style={styles.statusbar} />
        </View>

        <View style={{ alignItems: 'center', justifyContent: 'space-evenly' }}>
          <Text style={styles.nodataText}>일정을 기록해보세요</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('ScheduleToday')}
          >
            <IconArrow name="icon-arrow" size={24.4} color="#229892" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 2.25,
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    top: -500,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * ratio,
    opacity: 0.37,
    backgroundColor: '#000000',
  },
  backgroundWhite: {
    position: 'absolute',
    width: 131.5 * 2,
    // height: SCREEN_HEIGHT > 668 ? '61.5%' : '72%',
    height: SCREEN_HEIGHT * 0.428,
    top: SCREEN_HEIGHT > 668 ? 20 : 0,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 28,
    paddingVertical: 25,
    paddingTop: SCREEN_WIDTH * 0.0611,
    backgroundColor: '#f7fbfa',
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: {
      width: 0,
      height: 2.5,
    },
    shadowRadius: 7.5,
    shadowOpacity: 1,
  },
  noDataCard: {
    //width: SCREEN_WIDTH * 0.5,
    width: 194,
    maxHeight: 191,
    height: SCREEN_HEIGHT * 0.24,
    borderRadius: 20,
    // marginBottom: 30,
    marginBottom: SCREEN_HEIGHT * 0.03,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 42.5,
    backgroundColor: '#54bcb6',
    shadowColor: 'rgba(45, 172, 165, 0)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 7.5,
    shadowOpacity: 1,
  },
  circle: {
    backgroundColor: '#fff',
    width: 33,
    height: 33,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 18,
    top: 22,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.4,
    shadowRadius: 0.9,
  },
  cardText: {
    fontFamily: 'NotoSansKR-Black',
    marginTop: 35,
    color: '#fff',
    fontSize: 20,
  },
  statusbar: {
    width: 158,
    height: 6,
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  nodataText: {
    color: '#229892',
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 17,
    marginBottom: 10.6,
  },
});
