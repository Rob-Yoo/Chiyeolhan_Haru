import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, PixelRatio } from 'react-native';

import IconTaskToDoman from '#assets/icons/icon-todo-man';

import { getCurrentTime } from 'utils/timeUtil';
import { fontPercentage } from 'utils/responsiveUtil';

import { SCREEN_HEIGHT } from 'constant/const';
import * as Progress from 'react-native-progress';

const cardSize = 390 / PixelRatio.get();

export const Card = ({ text, finishTime, startTime, location, id, isDone }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (finishTime > getCurrentTime() && startTime < getCurrentTime()) {
      getProgressBarWidth();
      let intervalCallback = setInterval(() => {
        if (finishTime < getCurrentTime()) {
          clearInterval(intervalCallback);
        }
      }, 60000);
    } else {
      getProgressBarWidth();
    }
  }, []);

  const getProgressBarWidth = () => {
    if (getCurrentTime() >= finishTime) {
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
        console.log(width);
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
                  top: 12,
                  left: 17,
                  width: 2,
                  height: 11,
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
        <View style={{ position: 'relative', marginBottom: -11 }}>
          <Progress.Bar
            progress={width}
            width={180}
            color={'#fff'}
            unfilledColor={'#C4C4C4'}
            borderWidth={0}
            useNativeDriver
          />

          {/* <ProgressingBar startTime={startTime} finishTime={finishTime} /> */}
        </View>
      </View>
    </View>
  );
};

export const card = StyleSheet.create({
  card: {
    flex: SCREEN_HEIGHT > 668 ? 0.6 : 0.9,
    paddingHorizontal: 18,
    paddingVertical: 12,
    paddingTop: 2,
    borderRadius: 20,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 1.5,
    shadowRadius: 6.84,
    justifyContent: 'space-evenly',
    backgroundColor: 'rgba(84,188,182,1)',
    maxHeight: SCREEN_HEIGHT > 668 ? SCREEN_HEIGHT / 4.5 : SCREEN_HEIGHT / 3,
    minWidth: cardSize,
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
  },
  cardTitle: {
    fontFamily: 'NotoSansKR-Black',
    fontSize:
      Dimensions.get('window').height > 668
        ? fontPercentage(25)
        : fontPercentage(25),
    marginTop: 7,
    position: 'relative',
  },
  cardLocation: {
    fontFamily: 'NotoSansKR-Medium',
    fontSize: fontPercentage(10),
    fontWeight: '800',
    flexWrap: 'wrap',
    color: '#F4F4F4',
    marginLeft: 24,
    marginTop: 8,
    marginBottom: 10,
  },
  cardTime: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: fontPercentage(10),
    marginBottom: -5,
  },

  cardCalendarText: { fontFamily: 'notoSansKR-Bold' },
  defaultBar: {
    height: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});
