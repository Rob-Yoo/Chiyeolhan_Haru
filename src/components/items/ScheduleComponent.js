import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import WeekView from 'react-native-week-view';
import { useDispatch } from 'react-redux';

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

import {
  DAY,
  MONTH,
  YEAR,
  KEY_VALUE_GEOFENCE,
  SCREEN_HEIGHT,
} from 'constant/const';
import { CONTAINER_WIDTH } from 'react-native-week-view/src/utils';

const BACKGROUND_COLOR = '#ECF5F471';

const minutes20 = 1200000;
const minutes15 = 900000;
const munutes10 = 600000;

const MyEventComponent = ({ event, position }) => {
  const timeDiff = event.endDate - event.startDate;
  return (
    <View
      color={event.color}
      style={{
        flexDirection: timeDiff <= minutes20 ? 'row' : null,
        alignItems: timeDiff <= minutes20 ? 'center' : null,
      }}
    >
      <Text
        style={[
          styles.text,
          styles.description,
          {
            fontSize:
              (SCREEN_HEIGHT > 668 && timeDiff <= munutes10) ||
              (SCREEN_HEIGHT < 668 && timeDiff <= minutes15)
                ? 8
                : 13,
          },
        ]}
      >
        {event.description}
      </Text>
      <View style={{ flexDirection: 'row', marginLeft: 2.5 }}>
        <View
          style={{
            width:
              (SCREEN_HEIGHT > 668 && timeDiff <= munutes10) ||
              (SCREEN_HEIGHT < 668 && timeDiff <= minutes15)
                ? 2
                : 3,
            height:
              (SCREEN_HEIGHT > 668 && timeDiff <= munutes10) ||
              (SCREEN_HEIGHT < 668 && timeDiff <= minutes15)
                ? 10
                : 14,
            backgroundColor: '#fff',
            marginRight: 4,
          }}
        />
        <Text
          style={[
            styles.text,
            {
              fontSize:
                (SCREEN_HEIGHT > 668 && timeDiff <= munutes10) ||
                (SCREEN_HEIGHT < 668 && timeDiff <= minutes15)
                  ? 8
                  : 11,
            },
          ]}
        >
          {event.location}
        </Text>
      </View>
    </View>
  );
};

export const ScheduleComponent = ({ events, day, passToModalData }) => {
  const dispatch = useDispatch();

  const scrollRefresh = () => {
    console.log('refresh');
    //여기에 refresh 추가
    return Promise.resolve('true');
  };
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
      //eventContainerStyle={{ paddingHorizontal: 50 }}
      headerStyle={{
        color: BACKGROUND_COLOR,
        borderColor: BACKGROUND_COLOR,
      }}
      headerTextStyle={{ color: BACKGROUND_COLOR }}
      eventContainerStyle={{
        maxWidth: CONTAINER_WIDTH * 0.53,
        minHeight: SCREEN_HEIGHT > 668 ? 18 : 14,
        left: 40,
      }}
      EventComponent={MyEventComponent}
      scrollToTimeNow={day === 'today' ? true : false}
      scrollRefresh={() => scrollRefresh()}
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
                    await geofenceUpdate(data);
                    await deleteTodayAsyncStorageData(targetId);
                  } else {
                    await deleteGeofenceAsyncStorageData(targetId);
                    await deleteTodayAsyncStorageData(targetId);
                  }
                } else if (day === 'tomorrow') {
                  await deleteTomorrowAsyncStorageData(targetId);
                }
                await dispatch(deleteToDoDispatch(targetId));
              }
            } catch (e) {
              console.log('long onPress delete Error', e);
            }
          }
        }
      }}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#fff',
    textAlign: 'left',
    fontWeight: 'bold',
    fontFamily: 'NotoSansKR-bold',
  },
  description: {
    fontSize: 16,
    marginBottom: 2,
  },
});
