import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import IconTaskToDoman from '#assets/icons/icon-todo-man';

import { getCurrentTime } from 'utils/timeUtil';

import { SCREEN_WIDTH } from 'constant/const';
import * as Progress from 'react-native-progress';

export const Card = ({ text, finishTime, startTime, location, id, isDone }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (finishTime > getCurrentTime() && startTime <= getCurrentTime()) {
      getProgressBarWidth();
      let intervalCallback = setInterval(() => {
        if (isDone === false) {
          setWidth(0);
          clearInterval(intervalCallback);
          return;
        }
        getProgressBarWidth();
        if (
          finishTime <=
          new Date().getHours() * 60 + new Date().getMinutes() * 1
        ) {
          // console.log('clearIntervael');
          clearInterval(intervalCallback);
        }
      }, 60000);
    } else {
      getProgressBarWidth();
    }
  }, [isDone]);

  const stringToNumberTime = (time) => {
    if (typeof time === 'string')
      time = time?.split(':')[0] * 60 + time?.split(':')[1] * 1;
    return time;
  };

  const getProgressBarWidth = () => {
    //console.log('getProgress');
    if (isDone === false) return;
    if (typeof startTime === 'string') {
      startTime = stringToNumberTime(startTime);
      finishTime = stringToNumberTime(finishTime);
    }
    if (
      finishTime <=
      new Date().getHours() * 60 + new Date().getMinutes() * 1
    ) {
      setWidth(1);
      return;
    } else {
      const date = new Date();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const currentTime = hour * 60 + minute * 1;

      if (startTime < currentTime && finishTime > currentTime) {
        const denominator = finishTime - startTime;
        const numerator = currentTime - startTime;
        let width = (numerator / denominator).toFixed(2) * 1;
        setWidth(width);
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 0,
      }}
    >
      <View style={card.card} key={`CARD${id}`}>
        <View style={card.todomanBackgroundCircle}>
          <IconTaskToDoman name="icon-todo-man" size={18} color="#229892" />
        </View>
        <View
          style={{
            justifyContent: 'center',
            flexShrink: 1,
            maxHeight: 300,
          }}
        >
          <Text
            style={[
              card.cardTitle,
              {
                fontSize: 25.4,
                maxHeight: 60,
              },
            ]}
          >
            {text.length > 7 ? `${text.substring(0, 6)}..` : text}
          </Text>
          <View style={{ flexWrap: 'nowrap' }}>
            <View
              style={{
                position: 'relative',
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  top: 10.5,
                  left: 14.7,
                  width: 2,
                  //height: fontPercentage(11.5),
                  height: 11.5,
                  backgroundColor: '#00A29A',
                }}
              />
              <Text style={card.cardLocation}>
                {location?.length > 13
                  ? `${location.substr(0, 13)}...`
                  : location}
              </Text>
            </View>
          </View>
        </View>
        <Text style={card.cardTime}>
          {startTime}~{finishTime}
        </Text>
        <View
          style={{
            position: 'relative',
            marginBottom: -11,
          }}
        >
          <Progress.Bar
            progress={width}
            color={'#fff'}
            unfilledColor={'#C4C4C4'}
            borderWidth={0}
            width={SCREEN_WIDTH * 0.58 * 0.745}
            maxWidth={181}
            style={{ marginLeft: -3 }}
            useNativeDriver
          />
        </View>
      </View>
    </View>
  );
};

export const card = StyleSheet.create({
  card: {
    flex: 1,
    // paddingHorizontal: (262 * SCREEN_WIDTH) / 4850,
    paddingHorizontal: 20,
    width: 194,
    marginHorizontal: 10,
    height: SCREEN_WIDTH * 0.485,
    //maxHeight: 200,
    maxHeight: 190,
    paddingTop: 3,
    paddingBottom: 15,
    borderRadius: 15,
    justifyContent: 'space-evenly',
    backgroundColor: '#54bcb6',
    shadowColor: 'rgba(0,41,38,0.29)',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  todomanBackgroundCircle: {
    width: 28,
    height: 28,
    backgroundColor: '#ffffff',
    borderRadius: 100,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  cardTitle: {
    fontFamily: 'NotoSansKR-Black',
    marginTop: 13,
    position: 'relative',
  },
  cardLocation: {
    fontFamily: 'NotoSansKR-Medium',
    fontSize: 10.7,
    fontWeight: '800',
    flexWrap: 'wrap',
    color: '#F4F4F4',
    marginLeft: 20,
    marginTop: 8,
    marginBottom: 10,
  },
  cardTime: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 10.5,
    marginBottom: -5,
  },

  cardCalendarText: { fontFamily: 'notoSansKR-Bold' },
  defaultBar: {
    height: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});
