import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import IconTaskToDoman from '#assets/icons/icon-todo-man';
import { DAY, MONTH } from 'constant/const';
import { getCurrentTime } from 'utils/Time';
import {
  fontPercentage,
  heightPercentage,
  widthPercentage,
} from 'utils/responsive';
export const styles = StyleSheet.create({
  card: {
    maxHeight:
      Dimensions.get('screen').height > 667
        ? Dimensions.get('screen').height / 3.5
        : Dimensions.get('screen').height / 3,
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
    top: Dimensions.get('screen').height > 667 ? 11 : 12,
    left: 13,
    width: Dimensions.get('screen').height > 667 ? 50 : 50,
    height: Dimensions.get('screen').height > 667 ? 50 : 50,
    backgroundColor: '#ffffff',
    borderRadius: Dimensions.get('screen').height > 667 ? 50 : 50,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 1.34,
    shadowRadius: 4.84,
  },
  cardText: {
    position: 'relative',
  },
  cardTitle: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize:
      Dimensions.get('window').height > 667
        ? fontPercentage(24)
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
  isData,
}) => {
  const [width, setWidth] = useState('0%');
  useEffect(() => {
    getProgressBarWidth();
  }, []);

  const getProgressBarWidth = () => {
    if (!isDone) {
      setWidth('0%');
      return;
    }
    if (isDone && getCurrentTime() >= finishTime) {
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
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
      <View
        style={[
          styles.card,
          {
            flex: 1,
            maxWidth: 250,
            maxHeight: 250,
            justifyContent: 'space-between',
            backgroundColor: '#54BCB6',
          },
        ]}
        key={`CARD${id}`}
      >
        <View style={styles.todomanBackgroundCircle} />
        <IconTaskToDoman
          name="icon-todo-man"
          size={Dimensions.get('screen').height > 667 ? 35 : 35}
          color="#229892"
        />
        <View
          style={{
            justifyContent: 'center',
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
                  top: 5,
                  left: 5,
                  width: 5,
                  height: 20,
                  backgroundColor: '#00A29A',
                }}
              />
            )}
            <Text style={styles.cardLocation}>
              {location.length > 15 ? `${location.substr(0, 7)}...` : location}
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
      {/* <View style={[styles.card, styles.cardCalendar]}>
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
      </View> */}
    </View>
  );
};
