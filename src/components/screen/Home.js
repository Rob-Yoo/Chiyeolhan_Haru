import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import styled from 'styled-components/native';
import toDosSlice from 'redux/store';
import { Provider } from 'react-redux';
import HomeContent from 'components/items/HomeContent';
import { HomeTextItem } from 'components/items/HomeTextItem';
import IconTaskListLeft from '#assets/icons/icon-tasklist-left';
import IconGoToScheduleButton from '#assets/icons/icon-go-to-schedule-button';

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
  homeHeaderText: { flex: 0.7, paddingLeft: 15 },
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

const Home = ({ navigation }) => {
  const goToScheduleToday = () => navigation.navigate('ScheduleToday');
  return (
    <>
      <ImageBackground style={{ widht: '100%', height: '100%' }}>
        <View style={styles.homeContainer}>
          <View style={styles.homeHeaderText}>
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
        <Provider store={toDosSlice}>
          <HomeContent />
        </Provider>
      </ImageBackground>
    </>
  );
};

export default Home;
