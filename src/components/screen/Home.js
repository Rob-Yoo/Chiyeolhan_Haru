import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, AppState } from 'react-native';
import styled from 'styled-components/native';
import { useDispatch, useSelector } from 'react-redux';
import BackgroundGeolocation from 'react-native-background-geolocation';

import { init, setNetwork, setTabBar } from 'redux/store';

import HomeContent from 'components/items/HomeContent';
import { HomeTextItem } from 'components/items/HomeTextItem';
import { Loading } from 'components/screen/Loading';

import IconTaskListLeft from '#assets/icons/icon-tasklist-left';
import IconGoToScheduleButton from '#assets/icons/icon-go-to-schedule-button';

import { checkDayChange, loadSuccessSchedules } from 'utils/AsyncStorage';
import { dbService } from 'utils/firebase';
import { getDate } from 'utils/Time';

import { UID, CONTAINER_HEIGHT, CONTAINER_WIDTH } from 'constant/const';

const ScheduleButton = styled.TouchableOpacity``;

const Home = ({ navigation }) => {
  const goToScheduleToday = () => navigation.navigate('ScheduleToday');

  let todoArr = [];
  const dispatch = useDispatch();
  const { YESTERDAY, TODAY } = getDate();
  const [isLoading, setLoading] = useState(true);
  const toDos = useSelector((state) => state.toDos);
  const appState = useRef(AppState.currentState);

  const __handleAppStateChange = async (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      try {
        await BackgroundGeolocation.requestPermission();
        await loadSuccessSchedules();
        // const isDaychange = await checkDayChange();
      } catch (e) {
        console.log('requestPermission Deny:', e);
      }
    }
    appState.current = nextAppState;
  };

  useEffect(() => {
    AppState.addEventListener('change', __handleAppStateChange);
    readyForHome();
    return () => {
      AppState.removeEventListener('change', __handleAppStateChange);
    };
  }, []);

  const readyForHome = async () => {
    await getToDos();
    await checkDayChange();
    await loadSuccessSchedules();
    setLoading(false);
  };

  const getToDos = async () => {
    try {
      console.log('getToDos');
      dispatch(setNetwork('online'));
      dispatch(setTabBar('today'));
      setLoading(true);

      let rowObj = {};
      let filterObj = {};
      const row = await dbService.collection(`${UID}`).get();
      row.forEach((data) => (rowObj[data.id] = data.data()));
      if (Object.keys(rowObj).length === 0) {
        //데이터가 아무것도 없을때
        setLoading(false);
        return;
      }
      for (key in rowObj) {
        if (rowObj[key].date >= YESTERDAY)
          filterObj = { ...filterObj, [key]: rowObj[key] };
      }
      await dispatch(init(filterObj));
      setLoading(false);
      return;
    } catch (e) {
      console.log('getToDos Error :', e);
    }
  };

  for (key in toDos) {
    if (toDos[key].date === TODAY) todoArr.push(toDos[key]);
  }
  todoArr.sort((a, b) => {
    if (a.id < b.id) {
      return -1;
    }
    if (a.id > b.id) {
      return 1;
    }
    return 0;
  });
  console.log('Home');

  return isLoading ? (
    <Loading />
  ) : (
    <View style={styles.wrap}>
      <View style={styles.homeContainer}>
        <View style={styles.homeHeader}>
          <View style={styles.homeHeaderText}>
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
        <HomeContent todoArr={todoArr} />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: '#ECF5F471',
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeContainer: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
    backgroundColor: '#ECF5F471',
  },
  homeHeader: {
    flex: 1.3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  homeHeaderText: { flex: 0.7, paddingLeft: 15 },

  iconScheduleButton: { marginBottom: 10 },
  updateBtn: {
    width: 65,
    height: 65,
    borderRadius: 50,
    backgroundColor: 'red',
    justifyContent: 'center',
    position: 'absolute',
    right: -2,
  },
});
