import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Text,
} from 'react-native';
import styled from 'styled-components/native';

import { TODAY } from 'constant/const';
import { init } from 'redux/store';
import { useDispatch, useSelector } from 'react-redux';

import OffHomeContent from 'components/items/OffHomeContent';
import { HomeTextItem } from 'components/items/HomeTextItem';
import IconTaskListLeft from '#assets/icons/icon-tasklist-left';
import IconGoToScheduleButton from '#assets/icons/icon-go-to-schedule-button';
import { getDataFromAsync } from 'utils/AsyncStorage';
import {
  KEY_VALUE_OFFLINE,
  KEY_VALUE_TODAY_DATA,
  KEY_VALUE_TOMORROW_DATA,
} from 'constant/const';
import { setNetwork } from 'redux/store';

const ScheduleButton = styled.TouchableOpacity``;

/*Layout */
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get('window');
export const CONTENT_OFFSET = 16;
export const CONTAINER_HEIGHT = SCREEN_HEIGHT - 20;
export const CONTAINER_WIDTH = SCREEN_WIDTH - 20;

const styles = StyleSheet.create({
  homeBackground: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  homeContainer: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
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

const OffHome = ({ navigation, route }) => {
  const goToScheduleToday = () => navigation.navigate('ScheduleToday');
  const [isLoading, setLoading] = useState(true);
  const [fetchedToDo, setFetchObj] = useState({});
  let todoArr = [];
  let rowObj = {};
  const mounted = useRef(false);
  const mounted2 = useRef(false);
  const dispatch = useDispatch();
  const toDos = useSelector((state) => state.toDos);

  useEffect(() => {
    getToDos();
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
    }
  }, [toDos]);

  const getToDos = async () => {
    try {
      const todayAsyncData = await getDataFromAsync(KEY_VALUE_TODAY_DATA);
      const tomorrowAynscData = await getDataFromAsync(KEY_VALUE_TOMORROW_DATA);
      dispatch(setNetwork('offline'));
      rowObj = Object.assign(...todayAsyncData, ...tomorrowAynscData);
      if (Object.keys(rowObj).length === 0) {
        setLoading(false);
      }
      setFetchObj(rowObj);
    } catch (e) {
      console.log('getToDos Error :', e);
    }
  };
  for (key in toDos) {
    if (toDos[key].date === TODAY) todoArr.push(toDos[key]);
  }
  return isLoading ? (
    <View
      style={{
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
      }}
    >
      <Text>로딩</Text>
    </View>
  ) : (
    <ImageBackground
      source={{ uri: 'homeBackground' }}
      style={styles.homeBackground}
    >
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
        <OffHomeContent todoArr={todoArr} />
      </View>
    </ImageBackground>
  );
};

export default OffHome;
