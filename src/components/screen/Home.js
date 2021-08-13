import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styled from 'styled-components/native';

import toDos from 'redux/store';
import { Provider } from 'react-redux';

import HomeContent from 'components/HomeContent';
import IconTaskListLeft from '#assets/icons/icon-tasklist-left';
import IconGoToScheduleButton from '#assets/icons/icon-go-to-schedule-button';
import { HomeTextItem } from '../items/HomeTextItem';

const ScheduleButton = styled.TouchableOpacity``;

const styles = StyleSheet.create({
  homeContainer: {
    flex: 0.9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: -40,
    paddingBottom: 40,
    paddingHorizontal: 30,
  },
  homeHeader: { flex: 0.7, paddingLeft: 15 },
  homeHeaderRectangle: {
    position: 'absolute',
    top: 10,
    left: 0,
    width: 5,
    height: 65,
    backgroundColor: '#00A29A',

    shadowColor: '#00000029',
  },
  iconScheduleButton: { marginBottom: 10 },
});

function Home({ navigation }) {
  const goToScheduleToday = () => navigation.navigate('ScheduleToday');
  return (
    <>
      <View style={styles.homeContainer}>
        <View style={styles.homeHeader}>
          <View style={styles.homeHeaderRectangle} />
          <HomeTextItem />

          <IconTaskListLeft />
        </View>
        <ScheduleButton>
          <IconGoToScheduleButton
            name="icon-go-to-schedule-button"
            size={40}
            color={'#229892'}
            onPress={goToScheduleToday}
            style={styles.iconScheduleButton}
          />
        </ScheduleButton>
      </View>
      <Provider store={toDos}>
        <HomeContent />
      </Provider>
    </>
  );
}

export default Home;
