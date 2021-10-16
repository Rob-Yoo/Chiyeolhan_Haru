import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

import IconTaskToDoman from '#assets/icons/icon-todo-man';

import { getCurrentTime } from 'utils/timeUtil';
import { fontPercentage } from 'utils/responsiveUtil';

import { SCREEN_HEIGHT } from 'constant/const';
import { ProgressingBar } from 'components/items/ProgressingBar';
import PixelRatio from 'react-native/Libraries/Utilities/PixelRatio';

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
    <View style={{ flex: 1, flexDirection: 'row', margin: 0 }}>
      <View style={[card.card, {}]} key={`CARD${id}`}>
        <View style={card.todomanBackgroundCircle}>
          <IconTaskToDoman
            name="icon-todo-man"
            size={SCREEN_HEIGHT > 668 ? 25 : 20}
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
          <Text style={card.cardTitle}>{text}</Text>
          <View style={{ flexWrap: 'nowrap' }}>
            <View
              style={{
                position: 'absolute',
                top: 7,
                left: 7,
                width: 3,
                height: 14,
                backgroundColor: '#00A29A',
              }}
            />
            <Text style={card.cardLocation}>
              {location.length > 15 ? `${location.substr(0, 7)}...` : location}
            </Text>
          </View>
        </View>
        <Text style={card.cardTime}>
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
          />
          <View
            style={{
              width: width,
              height: 10,
              backgroundColor: '#FFFFFF',
              borderRadius: 5,
              position: 'absolute',
            }}
          />
          <ProgressingBar startTime={startTime} finishTime={finishTime} />
        </View>
      </View>
    </View>
  );
};

export const card = StyleSheet.create({
  card: {
    flex: 0.71,
    paddingHorizontal: 17,
    paddingVertical: 17,
    borderRadius: 20,
    // shadowColor: '#00000029',
    // shadowOffset: {
    //   width: 0,
    //   height: 15,
    // },
    // shadowOpacity: 1.5,
    // shadowRadius: 6.84,
    justifyContent: 'space-evenly',
    backgroundColor: 'rgba(84,188,182,1)',
    maxHeight: SCREEN_HEIGHT > 668 ? SCREEN_HEIGHT / 4.5 : SCREEN_HEIGHT / 3,
  },
  todomanBackgroundCircle: {
    width: SCREEN_HEIGHT > 668 ? 40 : 30,
    height: SCREEN_HEIGHT > 668 ? 40 : 30,
    backgroundColor: '#ffffff',
    borderRadius: 50,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.4,
    shadowRadius: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: 'NotoSansKR-Black',
    fontSize:
      Dimensions.get('window').height > 668
        ? fontPercentage(25)
        : fontPercentage(25),

    position: 'relative',
  },
  cardLocation: {
    fontFamily: 'NotoSansKR-Medium',
    fontSize: fontPercentage(10),
    fontWeight: '800',
    flexWrap: 'wrap',
    color: '#F4F4F4',
    marginTop: 5,
    marginLeft: 15,
  },
  cardTime: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: fontPercentage(10),
  },
  cardCalendar: {
    flex: 0.2,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cardCalendarText: { fontFamily: 'notoSansKR-Bold' },
});
