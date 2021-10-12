import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import IconTaskToDoman from '#assets/icons/icon-todo-man';
import IconArrow from '#assets/icons/icon-arrow';

import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'constant/const';

export const Nodata = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.wrap}>
      <View style={styles.background} />
      <View style={styles.backgroundWhite}>
        <View style={styles.noDataCard}>
          <View style={styles.circle}>
            <IconTaskToDoman name="icon-todo-man" size={30} color="#229892" />
          </View>
          <Text style={styles.cardText}>치열한 하루!</Text>
          <View style={styles.statusbar} />
        </View>

        <Text style={styles.nodataText}>일정을 기록해보세요</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ScheduleToday')}>
          <IconArrow name="icon-arrow" size={30} color="#229892" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 5,
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    top: -500,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT + 1000,
    opacity: 0.3,
    backgroundColor: '#000000',
  },
  backgroundWhite: {
    position: 'absolute',
    width: '80%',
    height: SCREEN_HEIGHT > 668 ? '55%' : '70%',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 20,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 15.5,
    shadowRadius: 5.84,
  },
  noDataCard: {
    width: 200,
    height: 200,
    backgroundColor: '#54BCB6',
    borderRadius: 20,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 40,
  },
  circle: {
    backgroundColor: '#fff',
    width: 40,
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 10,
    top: 10,
  },
  cardText: {
    fontFamily: 'NotoSansKR-Black',
    color: '#fff',
    fontSize: 20,
  },
  statusbar: {
    width: '80%',
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  nodataText: {
    color: '#229892',
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 20,
    marginBottom: 15,
  },
});
