import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import WeekView from 'react-native-week-view';
import { useDispatch, useSelector } from 'react-redux';

import { deleteToDoDispatch, init } from 'redux/store';

import { AlertView } from 'components/items/AlertView';

import IconQuestion from '#assets/icons/icon-question';

import { fontPercentage } from 'utils/responsiveUtil';

import { deleteToDoAlert } from 'utils/buttonAlertUtil';
import {
  deleteTomorrowAsyncStorageData,
  deleteTodayAsyncStorageData,
  deleteGeofenceAsyncStorageData,
  getDataFromAsync,
  loadSuccessSchedules,
} from 'utils/asyncStorageUtil';
import { dbService } from 'utils/firebaseUtil';
import { getCurrentTime, getDate } from 'utils/timeUtil';
import { geofenceUpdate } from 'utils/bgGeofenceUtil';

import {
  KEY_VALUE_GEOFENCE,
  SCREEN_HEIGHT,
  CONTAINER_WIDTH,
  UID,
} from 'constant/const';

const BACKGROUND_COLOR = '#ECF5F471';
const minutes45 = 2700000;
const minutes40 = 2400000;
const minutes25 = 1500000;
const minutes20 = 1200000;
const minutes15 = 900000;
const minutes10 = 600000;
const minutes5 = 300000;

const MyEventComponent = ({ event, position }) => {
  const timeDiff = event.endDate - event.startDate;
  return (
    <View
      color={event.color}
      style={{
        flexDirection: timeDiff <= minutes45 ? 'row' : null,
        alignItems: timeDiff <= minutes40 ? 'center' : null,
        justifyContent: 'flex-start',
        paddingVertical:
          timeDiff <= minutes40 ? (timeDiff < minutes15 ? 0 : 4) : '6%',
        paddingHorizontal: timeDiff <= minutes40 ? 0 : 15,
      }}
    >
      <Text
        style={[
          styles.text,
          styles.description,
          {
            fontSize:
              timeDiff <= minutes15 ? fontPercentage(9) : fontPercentage(15),
            marginBottom: timeDiff <= minutes40 ? 0 : 10,
          },
        ]}
      >
        {event.description}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          marginLeft:
            (SCREEN_HEIGHT > 668 && timeDiff <= minutes25) ||
            (SCREEN_HEIGHT < 668 && timeDiff <= minutes25)
              ? 3
              : 10,
        }}
      >
        <View
          style={{
            width:
              (SCREEN_HEIGHT > 668 && timeDiff <= minutes10) ||
              (SCREEN_HEIGHT < 668 && timeDiff <= minutes15)
                ? 2
                : 3,
            height:
              (SCREEN_HEIGHT > 668 && timeDiff <= minutes10) ||
              (SCREEN_HEIGHT < 668 && timeDiff <= minutes15)
                ? 9
                : 10,
            backgroundColor: '#fff',
            marginRight: 3,
          }}
        />
        <Text
          style={[
            styles.text,
            {
              fontSize:
                (SCREEN_HEIGHT > 668 && timeDiff <= minutes10) ||
                (SCREEN_HEIGHT < 668 && timeDiff <= minutes15)
                  ? 6
                  : 9,
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

export const scrollRefresh = async (dispatch) => {
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
  console.log(events);
  return (
    <>
      <WeekView
        events={events}
        selectedDate={selectedDate}
        fixedHorizontally={true}
        weekStartsOn={weekStart}
        numberOfDays={1}
        formatTimeLabel="H:mm A"
        showTitle={false}
        showNowLine={true}
        headerStyle={{
          color: BACKGROUND_COLOR,
          borderColor: BACKGROUND_COLOR,
          paddingTop: 11,
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
        headerTextStyle={{
          fontSize: fontPercentage(9),
          letterSpacing: -0.5,
          marginRight: '34.5%',
          color: '#5e5e5e',
        }}
        hourTextStyle={{
          color: '#5E5E5E',
          fontFamily: 'NotoSansKR-Regular',
          fontSize: fontPercentage(8),
        }}
        formatDateHeader={'M월 DD일'}
        eventContainerStyle={{
          maxWidth: CONTAINER_WIDTH * 0.5,
          minHeight: SCREEN_HEIGHT > 668 ? 18 : 14,
          left: 62,
          borderRadius: 8,
        }}
        EventComponent={MyEventComponent}
        nowLineColor={'#FD6363'}
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
      {network === 'online' && day === 'today' ? (
        <TouchableOpacity style={styles.alertButton} onPress={toggleAlert}>
          <IconQuestion name="icon-question" size={7.6} color="#fff" />
          {isVisibleAlert ? <AlertView /> : null}
        </TouchableOpacity>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#fff',
    textAlign: 'left',
    fontWeight: 'bold',
    fontFamily: 'GodoB',
  },
  description: {
    fontSize: 16,
  },
  alertButton: {
    position: 'absolute',
    top: 10,
    right: 30,
    width: 6.6 * 2,
    height: 6.6 * 2,
    backgroundColor: '#54BCB6',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
