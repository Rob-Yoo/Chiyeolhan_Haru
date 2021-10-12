import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import styled from 'styled-components/native';
import { useDispatch, useSelector } from 'react-redux';
import * as SplashScreen from 'expo-splash-screen';

import { init, setNetwork, setTabBar } from 'redux/store';

import { Loading } from 'components/screen/Loading';
import HomeContent from 'components/items/HomeContent';

import { getDate } from 'utils/Time';
import { getDataFromAsync } from 'utils/AsyncStorage';

import {
  KEY_VALUE_YESTERDAY_DATA,
  KEY_VALUE_TODAY_DATA,
  KEY_VALUE_TOMORROW_DATA,
  CONTAINER_HEIGHT,
  CONTAINER_WIDTH,
} from 'constant/const';
import { HomeHeader } from '../items/HomeHeader';

const ScheduleButton = styled.TouchableOpacity``;

const OffHome = ({ navigation, route }) => {
  const { TODAY } = getDate();
  const goToScheduleToday = () => navigation.navigate('ScheduleToday');
  const [isLoading, setLoading] = useState(false);
  const [fetchedToDo, setFetchObj] = useState({});
  let todoArr = [];
  let rowObj = {};
  const mounted = useRef(false);
  const mounted2 = useRef(false);
  const dispatch = useDispatch();
  const toDos = useSelector((state) => state.toDos);

  useEffect(() => {
    getToDos();
    dispatch(setNetwork('offline'));
    dispatch(setTabBar('today'));
  }, []);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      dispatch(init(fetchedToDo));
    }
  }, [fetchedToDo]);

  useEffect(() => {
    if (!mounted2.current) {
      mounted2.current = true;
    } else {
      setLoading(false);
      SplashScreen.hideAsync();
    }
  }, [toDos]);

  const getToDos = async () => {
    try {
      let todayAsyncData = (await getDataFromAsync(KEY_VALUE_TODAY_DATA)) ?? [];
      let tomorrowAsyncData =
        (await getDataFromAsync(KEY_VALUE_TOMORROW_DATA)) ?? [];
      let yesterdayAsyncData =
        (await getDataFromAsync(KEY_VALUE_YESTERDAY_DATA)) ?? [];
      if (
        todayAsyncData.length === 0 &&
        tomorrowAsyncData.length === 0 &&
        yesterdayAsyncData.length === 0
      ) {
        //데이터가 아무것도 없을때
        setLoading(false);
        return;
      }

      rowObj = Object.assign(
        ...yesterdayAsyncData,
        ...todayAsyncData,
        ...tomorrowAsyncData,
      );

      setFetchObj(rowObj);
    } catch (e) {
      console.log('getToDos Error :', e);
    }
  };
  for (key in toDos) {
    if (toDos[key].date === TODAY) todoArr.push(toDos[key]);
  }
  if (todoArr.length === 1) {
    todoArr.push({
      address: todoArr.address,
      date: todoArr.date,
      finishTime: todoArr.finishTime,
      id: todoArr.id,
      isDone: todoArr.isDone,
      isSkip: todoArr.isSkip,
      latitude: todoArr.latitude,
      location: todoArr.location,
      longitude: todoArr.longitude,
      startTime: todoArr.startTime,
      title: ' ',
      toDos: [],
    });
  }
  return isLoading ? (
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

export default OffHome;
