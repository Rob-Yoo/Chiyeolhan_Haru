import React, { useEffect, useState } from 'react';
import IconTaskToDoman from '#assets/icons/icon-todo-man';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#54BCB6',
    width: '90%',
    maxHeight: 220,
    padding: 30,
    marginHorizontal: 20,
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
    top: 25,
    left: 25,
    width: 60,
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 50,
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
    fontSize: 35,
    marginRight: 15,
    position: 'relative',
  },
  cardLocation: {
    fontFamily: 'NotoSansKR-Medium',
    fontWeight: '800',
    color: '#F4F4F4',
    marginBottom: 5,
  },
  cardTime: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 15,
  },
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
    if (isDone) {
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
    <View style={styles.card} key={`CARD` + id}>
      <View style={styles.todomanBackgroundCircle} />
      <IconTaskToDoman name="icon-todo-man" size={50} color="#229892" />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          flexShrink: 1,
          maxHeight: 300,
        }}
      >
        <Text style={styles.cardTitle}>{text}</Text>
        <View
          style={{
            flexWrap: 'nowrap',
          }}
        >
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
          <Text style={styles.cardLocation}>{location}</Text>
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
  );
};
