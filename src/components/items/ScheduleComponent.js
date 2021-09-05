import React from 'react';
import WeekView from 'react-native-week-view';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { DAY, MONTH, YEAR } from 'constant/const';
import { deleteToDoDispatch } from 'redux/store';
import { makeNowTime } from 'utils/Time';
import { deleteToDoAlert } from 'utils/TwoButtonAlert';
import { deleteTomorrowAsyncStorageData } from 'utils/AsyncStorage';
import { deleteTodayAsyncStorageData } from '../../utils/AsyncStorage';

const BACKGROUND_COLOR = '#ECF5F471';
const styles = StyleSheet.create({
  text: {
    color: '#fff',
    textAlign: 'left',
    fontWeight: 'bold',
    fontFamily: 'NotoSansKR-bold',
  },
  description: {
    fontSize: 20,
  },
  location: {
    fontSize: 10,
  },
});

const MyEventComponent = ({ event, position }) => {
  return (
    <>
      <View color={event.color}>
        <Text style={[styles.text, styles.description]}>
          {event.description}
        </Text>
        <View style={{ flexDirection: 'row', marginLeft: 15 }}>
          <View
            style={{
              width: 3,
              height: 15,
              backgroundColor: '#fff',
              marginRight: 5,
            }}
          />
          <Text style={[styles.text, styles.location]}>{event.location}</Text>
        </View>
      </View>
    </>
  );
};

export const ScheduleComponent = ({ events, day, passToModalData }) => {
  const dispatch = useDispatch();
  let weekStart = new Date().getDay();
  let selectedDate = '';
  switch (day) {
    case 'today':
      selectedDate = new Date(YEAR, MONTH - 1, DAY);
      break;
    case 'yesterday':
      selectedDate = new Date(YEAR, MONTH - 1, DAY - 1);
      weekStart -= 1;
      break;
    case 'tomorrow':
      selectedDate = new Date(YEAR, MONTH - 1, DAY + 1);
      weekStart = weekStart + 1;
      break;
  }

  return (
    <WeekView
      events={events}
      selectedDate={selectedDate}
      fixedHorizontally={true}
      weekStartsOn={weekStart}
      numberOfDays={1}
      formatTimeLabel="HH:mm A"
      showTitle={false}
      showNowLine={true}
      headerStyle={{
        color: BACKGROUND_COLOR,
        borderColor: BACKGROUND_COLOR,
      }}
      onEventPress={(event) => {
        if (
          (day !== 'today' || makeNowTime() < event.startTime) &&
          event.color !== '#54BCB6'
        ) {
          passToModalData(event);
        }
      }}
      onEventLongPress={async (event) => {
        const targetId = event.id;
        if (
          !(
            (day !== 'today' || makeNowTime() < event.startTime) &&
            event.color !== '#54BCB6'
          )
        )
          return;
        if ((await deleteToDoAlert(event)) === 'true') {
          dispatch(deleteToDoDispatch(targetId));
          if (day === 'today') {
            deleteTodayAsyncStorageData(targetId);
          } else if (day === 'tomorrow') {
            deleteTomorrowAsyncStorageData(targetId);
          }
        }
      }}
      headerTextStyle={{ color: BACKGROUND_COLOR }}
      eventContainerStyle={{
        maxWidth: 250,
        left: 40,
      }}
      scrollToTimeNow={day === 'today' ? true : false}
      EventComponent={MyEventComponent}
    />
  );
};
