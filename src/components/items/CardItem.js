import React from 'react';
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
  progressBar: {
    width: '100%',
    height: 10,
    backgroundColor: '#FFFFFF',
  },
});

export const Card = (props) => {
  const { text, finishtime, starttime, location, id } = props;
  return (
    <View style={styles.card}>
      <View style={styles.todomanBackgroundCircle} />
      <IconTaskToDoman
        name="icon-todo-man"
        size={50}
        color="#229892"
      ></IconTaskToDoman>

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
          <View
            style={{
              position: 'absolute',
              left: -10,
              width: 5,
              height: 20,
              backgroundColor: '#00A29A',
            }}
          ></View>
          <Text style={styles.cardLocation}>{location}</Text>
        </View>
      </View>
      <Text style={styles.cardTime}>
        {starttime}
        {id ? `` : '~'}
        {finishtime}
      </Text>

      <View style={styles.progressBar}></View>
      {id ? (
        <NoData
          style={{
            position: 'absolute',
            left: -100,
            width: 600,
            height: 600,
            backgroundColor: '#000',
            opacity: 0.2,
          }}
        >
          <Text
            style={{
              position: 'absolute',
              top: 50,
              right: '45%',
              top: '15%',
              color: '#FFFFFF',
              opacity: 1,
              fontFamily: 'NotoSansKR-Regular',
              fontSize: 20,
            }}
          >
            현재 일정이 없습니다
          </Text>
        </NoData>
      ) : null}
    </View>
  );
};
