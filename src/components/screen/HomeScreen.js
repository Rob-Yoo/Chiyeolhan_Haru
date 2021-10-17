import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, AppState, ImageBackground } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import BackgroundGeolocation from 'react-native-background-geolocation';
import RNRestart from 'react-native-restart';
import * as SplashScreen from 'expo-splash-screen';

import { init, setNetwork, setTabBar, setHomeRender } from 'redux/store';

import HomeContent from 'components/items/HomeContent';
import { HomeHeader } from 'components/items/HomeHeader';
import { Loading } from 'components/screen/LoadingScreen';

import { checkDayChange, loadSuccessSchedules } from 'utils/asyncStorageUtil';
import { dbService } from 'utils/firebaseUtil';
import { getDate } from 'utils/timeUtil';

import { UID, CONTAINER_HEIGHT, CONTAINER_WIDTH } from 'constant/const';

const Home = ({ navigation }) => {
  let todoArr = [];
  const dispatch = useDispatch();
  const homeRender = useSelector((state) => state.homerender);
  const { YESTERDAY, TODAY } = getDate();
  const [isLoading, setLoading] = useState(true);
  const toDos = useSelector((state) => state.toDos);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    AppState.addEventListener('change', __handleAppStateChange);
    readyForHome();
    return () => {
      AppState.removeEventListener('change', __handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    dispatch(setHomeRender(false));
  }, [homeRender]);

  const __handleAppStateChange = async (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      try {
        await BackgroundGeolocation.requestPermission();
        await loadSuccessSchedules();
        const isDaychange = await checkDayChange();
        if (isDaychange) {
          RNRestart.Restart();
        }
      } catch (e) {
        console.log('requestPermission Deny:', e);
      }
    }
    appState.current = nextAppState;
  };

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
    <ImageBackground source={{ uri: 'homeBackground' }} style={{ flex: 1 }}>
      <View style={styles.wrap}>
        <View style={styles.homeContainer}>
          <HomeHeader navigation={navigation} />
          <HomeContent todoArr={todoArr} />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeContainer: {
    flex: 2.25,
    width: CONTAINER_WIDTH,
    // height: CONTAINER_HEIGHT,
    //backgroundColor: '#ECF5F471',
  },
  homeHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  homeHeaderText: { flex: 0.7, paddingLeft: 15 },

  iconScheduleButton: { marginBottom: 10 },
});

export default Home;
