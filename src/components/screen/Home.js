import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, AppState } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import BackgroundGeolocation from 'react-native-background-geolocation';
import * as SplashScreen from 'expo-splash-screen';

import { init, setNetwork, setTabBar, setHomeRender } from 'redux/store';

import HomeContent from 'components/items/HomeContent';
import { Loading } from 'components/screen/Loading';
import { HomeHeader } from 'components/items/HomeHeader';

import { checkDayChange, loadSuccessSchedules } from 'utils/AsyncStorage';
import { dbService } from 'utils/firebase';
import { getDate } from 'utils/Time';

import { UID, CONTAINER_HEIGHT, CONTAINER_WIDTH } from 'constant/const';

const Home = ({ navigation }) => {
  let todoArr = [];
  const dispatch = useDispatch();
  const homeRender = useSelector((state) => state.homerender);
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
    await SplashScreen.hideAsync();
    //setLoading(false);
  };

  const getToDos = async () => {
    try {
      dispatch(setNetwork('online'));
      dispatch(setTabBar('today'));
      //setLoading(true);

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

  useEffect(() => {
    dispatch(setHomeRender(false));
  }, [homeRender]);

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

  return isLoading || homeRender ? (
    <Loading />
  ) : (
    <View style={styles.wrap}>
      <View style={styles.homeContainer}>
        <HomeHeader navigation={navigation} />
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

  iconScheduleButton: { marginBottom: 0 },
});
