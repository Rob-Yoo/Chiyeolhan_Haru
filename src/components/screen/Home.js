import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';

import toDos from 'redux/store';
import { Provider } from 'react-redux';

import HomeContent from 'components/HomeContent';
import IconTaskListLeft from '/assets/icons/icon-tasklist-left';
import IconGoToScheduleButton from '/assets/icons/icon-go-to-schedule-button';

const ScheduleButton = styled.TouchableOpacity``;

function Home({ navigation, props }) {
  const goToScheduleToday = () => navigation.navigate('ScheduleToday');
  return (
    <>
      <View
        style={{
          flex: 0.9,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginTop: -40,
          paddingBottom: 40,
          paddingHorizontal: 30,
        }}
      >
        <View style={{ flex: 0.7, paddingLeft: 15 }}>
          <View
            style={{
              position: 'absolute',
              top: 10,
              left: 0,
              width: 5,
              height: 65,
              backgroundColor: '#00A29A',

              shadowColor: '#00000029',
            }}
          />
          <Text
            style={{
              color: '#229892',
              fontWeight: '900',
              fontSize: 30,
              fontFamily: 'NotoSansKR-Bold',
              letterSpacing: 0,
              marginBottom: -10,
            }}
          >
            오늘도
          </Text>
          <Text
            style={{
              fontWeight: '900',
              fontSize: 30,
              fontFamily: 'NotoSansKR-Bold',
            }}
          >
            하루를 치열하게
          </Text>

          <IconTaskListLeft />
        </View>
        <ScheduleButton>
          <IconGoToScheduleButton
            name="icon-go-to-schedule-button"
            size={40}
            color={'#229892'}
            onPress={goToScheduleToday}
            style={{ marginBottom: 10 }}
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
