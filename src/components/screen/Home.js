import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import toDosSlice from 'redux/store';
import { Provider } from 'react-redux';
import HomeContent from 'components/items/HomeContent';
import { HomeTextItem } from 'components/items/HomeTextItem';
import IconTaskListLeft from '#assets/icons/icon-tasklist-left';
import IconGoToScheduleButton from '#assets/icons/icon-go-to-schedule-button';
import { checkTodayChange } from 'utils/AsyncStorage';
import { checkGeofenceSchedule } from 'utils/GeofenceScheduler';

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
});

const Home = ({ navigation }) => {
  const [visibleBtn, setVisibleBtn] = useState(false);
  const goToScheduleToday = () => navigation.navigate('ScheduleToday');

  useEffect(() => {
    const resetButton = checkGeofenceSchedule();
    setVisibleBtn(resetButton);
    checkTodayChange();
  }, []);

  return (
    <>
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
          <Provider store={toDosSlice}>
            <HomeContent />
          </Provider>
        </View>
      </ImageBackground>
    </>
  );
};

export default Home;
