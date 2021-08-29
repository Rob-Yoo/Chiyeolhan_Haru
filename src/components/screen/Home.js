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
  const goToScheduleToday = () => navigation.navigate('ScheduleToday');
  return (
    <>
      <ImageBackground
        source={{ uri: 'homeBackground' }}
        style={{ widht: '100%', height: '100%', paddingHorizontal: 20 }}
      >
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
      </ImageBackground>
    </>
  );
};

export default Home;
