import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, PixelRatio } from 'react-native';

import IconTaskToDoman from '#assets/icons/icon-todo-man';

import { getCurrentTime } from 'utils/timeUtil';
import { fontPercentage } from 'utils/responsiveUtil';

import { SCREEN_WIDTH } from 'constant/const';
import * as Progress from 'react-native-progress';

export const Card = ({ text, finishTime, startTime, location, id, isDone }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (finishTime > getCurrentTime() && startTime <= getCurrentTime()) {
      getProgressBarWidth();
      let intervalCallback = setInterval(() => {
        if (
          finishTime <=
          new Date().getHours() * 60 + new Date().getMinutes() * 1
        ) {
          clearInterval(intervalCallback);
        }
        getProgressBarWidth();
      }, 60000);
    } else {
      getProgressBarWidth();
    }
  }, []);

  const getProgressBarWidth = () => {
    if (
      typeof finishTime === 'number'
        ? new Date().getHours() * 60 + new Date().getMinutes() * 1
        : getCurrentTime() >= finishTime
    ) {
      setWidth(1);
      return;
    } else {
      const date = new Date();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const currentTime = hour * 60 + minute * 1;

      if (typeof startTime === 'string') {
        startTime =
          startTime?.split(':')[0] * 60 + startTime?.split(':')[1] * 1;
        finishTime =
          finishTime?.split(':')[0] * 60 + finishTime?.split(':')[1] * 1;
      }
      if (startTime < currentTime && finishTime > currentTime) {
        const denominator = finishTime - startTime;
        const numerator = currentTime - startTime;
        let width = (numerator / denominator).toFixed(2) * 1;

        setWidth(width);
      }
    }
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row', margin: 0 }}>
      <View style={[card.card]} key={`CARD${id}`}>
        <View style={card.todomanBackgroundCircle}>
          <IconTaskToDoman name="icon-todo-man" size={20} color="#229892" />
        </View>
        <View
          style={{
            justifyContent: 'center',
            flexShrink: 1,
            maxHeight: 300,
          }}
        >
          <Text style={card.cardTitle}>{text}</Text>
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
                  height: fontPercentage(11.5),
                  backgroundColor: '#00A29A',
                }}
              />
              <Text style={card.cardLocation}>
                {location?.length > 15
                  ? `${location.substr(0, 7)}...`
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
    paddingHorizontal: (262 * SCREEN_WIDTH) / 4850,
    marginHorizontal: 10,
    height: SCREEN_WIDTH * 0.485,
    paddingTop: 1.5,
    paddingBottom: 15,
    borderRadius: 15,
    justifyContent: 'space-evenly',
    backgroundColor: 'rgba(84,188,182,1.5)',
    shadowColor: 'rgba(0,41,38,0.29)',
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  todomanBackgroundCircle: {
    width: 32,
    height: 32,
    backgroundColor: '#ffffff',
    borderRadius: 50,
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
    fontSize:
      Dimensions.get('window').height > 668
        ? fontPercentage(25.4)
        : fontPercentage(25),
    marginTop: 13,
    position: 'relative',
  },
  cardLocation: {
    fontFamily: 'NotoSansKR-Medium',
    fontSize: fontPercentage(10.7),
    fontWeight: '800',
    flexWrap: 'wrap',
    color: '#F4F4F4',
    marginLeft: 20,
    marginTop: 8,
    marginBottom: 10,
  },
  cardTime: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: fontPercentage(10.5),
    marginBottom: -5,
  },

  cardCalendarText: { fontFamily: 'notoSansKR-Bold' },
  defaultBar: {
    height: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});
