import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import styled from 'styled-components/native';

import { dbService } from 'utils/firebase';
import { UID, TODAY } from 'constant/const';
import { init } from 'redux/store';
import { useDispatch, useSelector } from 'react-redux';

import HomeContent from 'components/items/HomeContent';
import { HomeTextItem } from 'components/items/HomeTextItem';
import IconTaskListLeft from '#assets/icons/icon-tasklist-left';
import IconGoToScheduleButton from '#assets/icons/icon-go-to-schedule-button';
import { YESTERDAY } from 'constant/const';
import { setNetwork, setTabBar } from 'redux/store';
import { Loading } from './Loading';

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

const Home = ({ navigation }) => {
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
      const row = await dbService.collection(`${UID}`).get();
      row.forEach((data) => (rowObj[data.id] = data.data()));
      dispatch(setNetwork('online'));
      dispatch(setTabBar('today'));
      if (Object.keys(rowObj).length === 0) {
        setLoading(false);
        return;
      }
      let filterObj = {};
      for (key in rowObj) {
        if (rowObj[key].date >= YESTERDAY)
          filterObj = { ...filterObj, [key]: rowObj[key] };
      }
      setFetchObj(filterObj);
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

  return isLoading ? (
    <Loading />
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
        <HomeContent todoArr={todoArr} />
      </View>
    </ImageBackground>
  );
};

export default Home;
