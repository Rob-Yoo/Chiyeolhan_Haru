import React from 'react';
import WeekView from 'react-native-week-view';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { DAY, MONTH, YEAR, KEY_VALUE_GEOFENCE } from 'constant/const';
import { deleteToDoDispatch } from 'redux/store';
import { deleteToDoAlert } from 'utils/TwoButtonAlert';
import {
  deleteTomorrowAsyncStorageData,
  deleteTodayAsyncStorageData,
  deleteGeofenceAsyncStorageData,
  getDataFromAsync,
} from 'utils/AsyncStorage';
import { geofenceUpdate } from 'utils/BgGeofence';
import { getCurrentTime } from 'utils/Time';

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
  //console.log('schedule component');
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
      onEventPress={async (event) => {
        passToModalData(event);
      }}
      onEventLongPress={async (event) => {
        const targetId = event.id;
        const data = await getDataFromAsync(KEY_VALUE_GEOFENCE);
        const currentTime = getCurrentTime();
        const startTime = event.startTime;

        if (day !== 'yesterday') {
          if (
            (day === 'today' && currentTime < startTime) ||
            day === 'tomorrow'
          ) {
            try {
              if ((await deleteToDoAlert(event)) === 'true') {
                if (day === 'today') {
                  if (event.id == data[0].id) {
                    await geofenceUpdate(data, false);
                    deleteTodayAsyncStorageData(targetId);
                  } else {
                    deleteGeofenceAsyncStorageData(targetId);
                    deleteTodayAsyncStorageData(targetId);
                  }
                } else if (day === 'tomorrow') {
                  deleteTomorrowAsyncStorageData(targetId);
                }
                await dispatch(deleteToDoDispatch(targetId));
              }
            } catch (e) {
              console.log('long onPress delete Error', e);
            }
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
