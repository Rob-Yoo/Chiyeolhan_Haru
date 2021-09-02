import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import IconTaskToDoman from '#assets/icons/icon-todo-man';
import { DAY, MONTH } from 'constant/const';

import {
  fontPercentage,
  heightPercentage,
  widthPercentage,
} from 'utils/responsive';
export const styles = StyleSheet.create({
  card: {
    maxHeight:
      Dimensions.get('screen').height > 667
        ? Dimensions.get('screen').height / 4
        : Dimensions.get('screen').height / 3.5,
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 20,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 3.4,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  todomanBackgroundCircle: {
    position: 'absolute',
    top: Dimensions.get('screen').height > 667 ? 10 : 12,
    left: 12,
    width: Dimensions.get('screen').height > 667 ? 60 : 50,
    height: Dimensions.get('screen').height > 667 ? 60 : 50,
    backgroundColor: '#ffffff',
    borderRadius: Dimensions.get('screen').height > 667 ? 60 : 50,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.34,
    shadowRadius: 5.84,
  },
  cardText: {
    position: 'relative',
  },
  cardTitle: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize:
      Dimensions.get('window').height > 667
        ? fontPercentage(30)
        : fontPercentage(20),
    marginRight: 15,
    position: 'relative',
  },
  cardLocation: {
    fontFamily: 'NotoSansKR-Medium',
    fontSize: fontPercentage(12),
    fontWeight: '800',
    flexWrap: 'wrap',
    // backgroundColor: 'red',
    color: '#F4F4F4',
    marginBottom: 5,
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
  isData,
}) => {
  const [width, setWidth] = useState('0%');
  useEffect(() => {
    getProgressBarWidth();
  }, []);

  const getProgressBarWidth = () => {
    const startH = finishTime.replace(/:\d\d/, '');
    const startM = finishTime.replace(/\d\d:/, '');
    if (
      isDone &&
      new Date().getHours() >= startH &&
      new Date().getMinutes() >= startM
    ) {
      setWidth('100%');
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
            flex: 0.8,
            justifyContent: 'space-between',
            backgroundColor: '#54BCB6',
          },
        ]}
        key={`CARD${id}`}
      >
        <View style={styles.todomanBackgroundCircle} />
        <IconTaskToDoman
          name="icon-todo-man"
          size={Dimensions.get('screen').height > 667 ? 42 : 35}
          color="#229892"
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            flexShrink: 1,
            maxHeight: 300,
          }}
        >
          <Text style={styles.cardTitle}>{text}</Text>
          <View style={{ flexWrap: 'nowrap' }}>
            {!isData ? (
              <></>
            ) : (
              <View
                style={{
                  position: 'absolute',
                  left: -10,
                  width: 5,
                  height: 20,
                  backgroundColor: '#00A29A',
                }}
              />
            )}
            <Text style={styles.cardLocation}>
              {location.length > 8 ? `${location.substr(0, 7)}...` : location}
            </Text>
          </View>
        </View>
        <Text style={styles.cardTime}>
          {startTime}
          {!isData ? `` : `~`}
          {finishTime}
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
      <View style={[styles.card, styles.cardCalendar]}>
        <Text
          style={[
            styles.cardCalendarText,
            {
              fontSize:
                Dimensions.get('window').height > 667
                  ? fontPercentage(40)
                  : fontPercentage(35),
            },
          ]}
        >
          {DAY}
        </Text>
        <Text
          style={[
            styles.cardCalendarText,
            { fontSize: fontPercentage(25), color: '#458B87' },
          ]}
        >
          {MONTH} 월
        </Text>
      </View>
    </View>
  );
};
