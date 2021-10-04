import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

import IconTaskToDoman from '#assets/icons/icon-todo-man';

import { getCurrentTime } from 'utils/Time';
import { fontPercentage } from 'utils/responsive';

import { SCREEN_HEIGHT } from 'constant/const';
export const styles = StyleSheet.create({
  card: {
    maxHeight: SCREEN_HEIGHT > 668 ? SCREEN_HEIGHT / 3.5 : SCREEN_HEIGHT / 3,

    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 1.5,
    shadowRadius: 6.84,
  },
  todomanBackgroundCircle: {
    width: SCREEN_HEIGHT > 668 ? 50 : 40,
    height: SCREEN_HEIGHT > 668 ? 50 : 40,
    backgroundColor: '#ffffff',
    borderRadius: 50,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 1.5,
    shadowRadius: 5.84,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize:
      Dimensions.get('window').height > 668
        ? fontPercentage(22)
        : fontPercentage(20),

    position: 'relative',
  },
  cardLocation: {
    fontFamily: 'NotoSansKR-Medium',
    fontSize: fontPercentage(12),
    fontWeight: '800',
    flexWrap: 'wrap',
    // backgroundColor: 'red',
    color: '#F4F4F4',
    marginTop: 5,
    marginLeft: 15,
  },
  cardTime: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: fontPercentage(15),
  },
  cardCalendar: {
    flex: 0.2,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cardCalendarText: { fontFamily: 'notoSansKR-Bold' },
});

export const Card = ({
  text,
  finishTime: finishTime,
  startTime: startTime,
  location,
  id,
  isDone,
}) => {
  const [width, setWidth] = useState('0%');
  useEffect(() => {
    getProgressBarWidth();
  }, []);

  const getProgressBarWidth = () => {
    if (getCurrentTime() >= finishTime) {
      setWidth('100%');
      return;
    } else {
      const date = new Date();
      const hour =
        date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
      const minute =
        date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
      const currentTime = (hour.toString() + minute.toString()) * 1;
      startTime = startTime.replace(':', '');
      finishTime = finishTime.replace(':', '');
      if (startTime < currentTime && finishTime > currentTime) {
        const denominator = finishTime - startTime;
        const numerator = currentTime - startTime;
        let width = Math.floor((numerator / denominator) * 100);
        setWidth(`${width}%`);
      }
    }
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <View
        style={[
          styles.card,
          {
            flex: 1,
            maxWidth: SCREEN_HEIGHT > 668 ? 250 : 220,
            maxHeight: SCREEN_HEIGHT > 668 ? 250 : 220,
            justifyContent: 'space-evenly',
            backgroundColor: '#54BCB6',
          },
        ]}
        key={`CARD${id}`}
      >
        <View style={styles.todomanBackgroundCircle}>
          <IconTaskToDoman
            name="icon-todo-man"
            size={SCREEN_HEIGHT > 668 ? 35 : 30}
            color="#229892"
          />
        </View>
        <View
          style={{
            justifyContent: 'center',
            flexShrink: 1,
            maxHeight: 300,
          }}
        >
          <Text style={styles.cardTitle}>{text}</Text>
          <View style={{ flexWrap: 'nowrap' }}>
            <View
              style={{
                position: 'absolute',
                top: 5,
                left: 5,
                width: 5,
                height: 20,
                backgroundColor: '#00A29A',
              }}
            />
            <Text style={styles.cardLocation}>
              {location.length > 15 ? `${location.substr(0, 7)}...` : location}
            </Text>
          </View>
        </View>
        <Text style={styles.cardTime}>
          {startTime}~{finishTime}
        </Text>
        <View style={{ position: 'relative' }}>
          <View
            style={{
              width: '100%',
              height: 10,
              backgroundColor: '#C4C4C4',
              borderRadius: 5,
              bottom: 0,
            }}
          ></View>
          <View
            style={{
              width: width,
              height: 10,
              backgroundColor: '#FFFFFF',
              borderRadius: 5,
              position: 'absolute',
            }}
          ></View>
        </View>
      </View>
    </View>
  );
};
