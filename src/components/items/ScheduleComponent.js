import React from 'react';
import WeekView from 'react-native-week-view';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { DAY, MONTH, YEAR, KEY_VALUE_GEOFENCE, UID } from 'constant/const';
import { deleteToDoDispatch } from 'redux/store';
import { dbService } from 'utils/firebase';
import {
  deleteToDoAlert,
  denyDeleteToDoAlert,
  denyEditToDoAlert,
} from 'utils/TwoButtonAlert';
import {
  deleteTomorrowAsyncStorageData,
  deleteTodayAsyncStorageData,
  deleteGeofenceAsyncStorageData,
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
        const currentTime = getCurrentTime();
        const startTime = event.startTime;
        const finishTime = event.finishTime;

        if (day !== 'today' || currentTime < startTime) {
          try {
            const item = await AsyncStorage.getItem(KEY_VALUE_GEOFENCE);
            const data = JSON.parse(item);
            const toDoRef = dbService.collection(`${UID}`).doc(`${data[0].id}`);
            const currentSchedule = await toDoRef.get();
            if (currentSchedule.data().isDone == true) {
              denyEditToDoAlert('ARRIVE_EARLY');
            } else {
              passToModalData(event);
            }
          } catch (e) {
            console.log('onEventPress Edit :', e);
          }
        } else if (currentTime >= startTime) {
          if (startTime <= currentTime && currentTime < finishTime) {
            denyEditToDoAlert('CURRENT');
          } else {
            denyEditToDoAlert('PREVIOUS');
          }
        }
      }}
      onEventLongPress={async (event) => {
        const targetId = event.id;
        const item = await AsyncStorage.getItem(KEY_VALUE_GEOFENCE);
        const data = JSON.parse(item);
        const currentTime = getCurrentTime();
        const startTime = event.startTime;
        const finishTime = event.finishTime;

        if (!(day !== 'today' || currentTime < startTime)) {
          if (startTime <= currentTime && currentTime < finishTime) {
            denyDeleteToDoAlert('CURRENT');
          } else {
            denyDeleteToDoAlert('PREVIOUS');
          }
        } else {
          const toDoRef = dbService.collection(`${UID}`).doc(`${data[0].id}`);
          const currentSchedule = await toDoRef.get();
          if (currentSchedule.data().isDone == true) {
            denyDeleteToDoAlert('ARRIVE_EARLY');
          } else {
            try {
              if ((await deleteToDoAlert(event)) === 'true') {
                await dispatch(deleteToDoDispatch(targetId));
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
