import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import WeekView from 'react-native-week-view';
import { useDispatch, useSelector } from 'react-redux';

import { deleteToDoDispatch, init } from 'redux/store';

import IconQuestion from '#assets/icons/icon-question';

import { deleteToDoAlert } from 'utils/TwoButtonAlert';
import {
  deleteTomorrowAsyncStorageData,
  deleteTodayAsyncStorageData,
  deleteGeofenceAsyncStorageData,
  getDataFromAsync,
  loadSuccessSchedules,
} from 'utils/AsyncStorage';
import { dbService } from 'utils/firebase';
import { getCurrentTime, getDate } from 'utils/Time';
import { geofenceUpdate } from 'utils/BgGeofence';

import {
  KEY_VALUE_GEOFENCE,
  SCREEN_HEIGHT,
  CONTAINER_WIDTH,
  UID,
} from 'constant/const';
import { AlertView } from './layout/AlertView';

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
        justifyContent: 'center',
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
      <View style={{ flexDirection: 'row', marginLeft: 2.5, paddingTop: 1 }}>
        <View
          style={{
            width:
              (SCREEN_HEIGHT > 668 && timeDiff <= munutes10) ||
              (SCREEN_HEIGHT < 668 && timeDiff <= minutes15)
                ? 2
                : 3,
            height: 13,
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

const getSelectedDate = (day) => {
  let weekStart = new Date().getDay();
  const { YEAR, MONTH, DAY } = getDate();

  switch (day) {
    case 'today':
      return [new Date(YEAR, MONTH - 1, DAY), weekStart];

    case 'yesterday':
      weekStart -= 1;
      return [new Date(YEAR, MONTH - 1, DAY - 1), weekStart];

    case 'tomorrow':
      weekStart = weekStart + 1;
      return [new Date(YEAR, MONTH - 1, DAY + 1), weekStart];
  }
};

const scrollRefresh = async (dispatch) => {
  try {
    await loadSuccessSchedules();

    let rowObj = {};
    let filterObj = {};
    const { YESTERDAY } = getDate();
    const row = await dbService.collection(`${UID}`).get();
    row.forEach((data) => (rowObj[data.id] = data.data()));
    if (Object.keys(rowObj).length === 0) {
      //데이터가 아무것도 없을때
      return Promise.resolve('true');
    }
    for (key in rowObj) {
      if (rowObj[key].date >= YESTERDAY)
        filterObj = { ...filterObj, [key]: rowObj[key] };
    }
    dispatch(init(filterObj));
    return Promise.resolve('true');
  } catch (e) {
    console.log('scrollRefresh Error :', e);
  }
};

export const ScheduleComponent = ({ events, day, passToModalData }) => {
  const dispatch = useDispatch();
  const network = useSelector((state) => state.network);
  let [tempDate, tempWeekStart] = getSelectedDate(day);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [weekStart, setWeekStart] = useState(tempWeekStart);
  const [selectedDate, setSelectedDate] = useState(tempDate);
  const [isVisibleAlert, setIsVisibleAlert] = useState(false);
  const toggleAlert = () => {
    setIsVisibleAlert(!isVisibleAlert);
  };

  return (
    <>
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
        headerTextStyle={{ color: '#5E5E5E', marginRight: 120, fontSize: 10 }}
        formatDateHeader={'M월 DD일'}
        eventContainerStyle={{
          maxWidth: CONTAINER_WIDTH * 0.53,
          minHeight: SCREEN_HEIGHT > 668 ? 18 : 14,
          left: 40,
        }}
        EventComponent={MyEventComponent}
        isRefreshing={isRefreshing}
        scrollToTimeNow={day === 'today' ? true : false}
        network={network}
        scrollRefresh={() => scrollRefresh(dispatch)}
        onEventPress={async (event) => {
          passToModalData(event);
        }}
        onEventLongPress={async (event) => {
          const targetId = event.id;
          const data = await getDataFromAsync(KEY_VALUE_GEOFENCE);
          const currentTime = getCurrentTime();
          const startTime = event.startTime;

          if (
            (network === 'online' &&
              day === 'today' &&
              currentTime < startTime) ||
            (network === 'online' && day === 'tomorrow')
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
        }}
      />
      <TouchableOpacity style={styles.alertButton} onPress={toggleAlert}>
        <IconQuestion name="icon-question" size={10} color="#fff" />
        {isVisibleAlert ? <AlertView /> : null}
      </TouchableOpacity>
    </>
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
  },
  allertButton: {
    position: 'absolute',
    top: 10,
    right: 25,
    width: 18,
    height: 18,
    backgroundColor: '#54BCB6',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
