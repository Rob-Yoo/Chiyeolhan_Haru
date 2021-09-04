import BackgroundGeolocation from 'react-native-background-geolocation';
import AsyncStorage from '@react-native-community/async-storage';
import { dbService } from 'utils/firebase';
import { UID, KEY_VALUE_GEOFENCE, KEY_VALUE_NEAR_BY } from 'constant/const';
import PushNotification from 'react-native-push-notification';
import { getEarlyTimeDiff, getLateTimeDiff, getTimeDiff } from 'utils/Time';
import {
  completeNotification,
  notifHandler,
  nearByNotification,
  completeNearbyNotif,
} from 'utils/Notification';
import getDistance from 'haversine-distance';

const completeNotifHandler = (data) => {
  if (data.length >= 2) {
    const nextScheduleStartTime = data[1].startTime;
    const nextScheduleLocation = data[1].location;
    completeNotification(true, nextScheduleStartTime, nextScheduleLocation);
  } else {
    completeNotification(false);
  }
};

const cmpltNearByNotifHandler = (schedule, idx, data, currentTime) => {
  let isLast = false;
  let nextStartTime = '';
  let nextLocation = '';
  const finishTime = schedule.finishTime;
  const timeDiff = getTimeDiff(currentTime, finishTime);

  if (data.length - 1 == idx) {
    isLast = true;
  } else {
    nextStartTime = data[idx + 1].startTime;
    nextLocation = data[idx + 1].location;
  }
  completeNearbyNotif(isLast, data, idx, nextStartTime, nextLocation, timeDiff);
};

const addGeofence = async (latitude, longitude, data) => {
  try {
    await BackgroundGeolocation.addGeofence({
      identifier: `${UID}`,
      radius: 200,
      latitude,
      longitude,
      notifyOnEntry: true,
      notifyOnExit: true,
    });
    console.log('Adding Geofence Success!!', data.location);
  } catch (e) {
    console.log('addGeofence Error :', e);
  }
};

export const addGeofenceTrigger = async () => {
  try {
    const item = await AsyncStorage.getItem(KEY_VALUE_GEOFENCE);
    const data = JSON.parse(item);
    if (data.length != 0) {
      const lat = data[0].latitude;
      const lng = data[0].longitude;
      await addGeofence(lat, lng, data);
    } else {
      await BackgroundGeolocation.removeGeofence(`${UID}`);
      console.log('[removeGeofence] success');
      await BackgroundGeolocation.startGeofences();
    }
  } catch (error) {
    'addGeofenceTrigger Error :', error;
  }
};

export const geofenceUpdate = async (data, isSuccess = true, index = 1) => {
  try {
    await BackgroundGeolocation.stop();
    console.log('stop geolocation success');
    if (isSuccess) {
      const toDoRef = dbService.collection(`${UID}`).doc(`${data[0].id}`);
      await toDoRef.update({ isDone: true });
    }
    const newDataArray = data.slice(index);
    await AsyncStorage.setItem(
      KEY_VALUE_GEOFENCE,
      JSON.stringify(newDataArray),
    );
    await addGeofenceTrigger();
    await BackgroundGeolocation.startGeofences();
  } catch (e) {
    console.log('geofenceUpdate Error :', e);
  }
};

const findNearBy = async (data, currentTime) => {
  // 현재 일정 장소와 200m 이내에 있는 다음 일정 장소 찾기
  let nearBySchedules = [];
  const currentScheduleLocation = {
    lat: data[0].latitude,
    lon: data[0].longitude,
  };
  const toDoRef = dbService.collection(`${UID}`);
  let idx = 0;
  const nextSchedules = data.slice(1);
  const timeDiff = getTimeDiff(currentTime, data[0].finishTime);

  try {
    if (data.length == 0) {
      completeNearbyNotif(true, data, 0, null, null, timeDiff);
      await toDoRef.doc(`${data[0].id}`).update({ isDone: true });
      return;
    } else {
      completeNearbyNotif(
        false,
        data,
        0,
        data[1].startTime,
        data[1].location,
        timeDiff,
      );
      await toDoRef.doc(`${data[0].id}`).update({ isDone: true });
    }
  } catch (e) {
    console.log('findNearBy Error :', e);
  }

  nextSchedules.forEach((nextSchedule) => {
    const nextScheduleLocation = {
      lat: nextSchedule.latitude,
      lon: nextSchedule.longitude,
    };
    distance = getDistance(currentScheduleLocation, nextScheduleLocation);
    console.log(distance);
    if (distance > 200) {
      return;
    } else {
      try {
        idx = idx + 1;
        await toDoRef.doc(`${nextSchedule.id}`).update({ isDone: true });
        const timeDiff = getEarlyTimeDiff(nextSchedule.startTime, currentTime);
        nearByNotification(nextSchedule.id, timeDiff); // 각 일정들마다 도착 알림 예약
        cmpltNearByNotifHandler(nextSchedule, idx, data, currentTime);
        nearBySchedules.push(nextSchedule);
      } catch (e) {
        console.log('findNearBy Error :', e);
      }
    }
  });
  console.log(nearBySchedules);
  return nearBySchedules;
};

const enterAction = async (data, startTime, finishTime, currentTime) => {
  try {
    if (startTime <= currentTime && currentTime <= finishTime) {
      const timeDiff = getLateTimeDiff(startTime, currentTime);
      if (0 <= timeDiff && timeDiff <= 5) {
        console.log('제 시간에 옴', currentTime);
        notifHandler('ON_TIME');
      } else {
        console.log('늦게 옴', currentTime);
        notifHandler('LATE');
      }
    } else if (currentTime > finishTime) {
      console.log('일정 끝시간보다 늦게 옴', currentTime);
      notifHandler('FAIL');
      await geofenceUpdate(data, false); // isDone으로 안바꾸고 다음 지오펜스 업데이트
    } else {
      const timeDiff = getEarlyTimeDiff(startTime, currentTime);
      console.log('일찍 옴', currentTime);
      notifHandler('EARLY', timeDiff);
    }
    const nearBySchedules = await findNearBy(data, currentTime);
    await AsyncStorage.setItem(
      KEY_VALUE_NEAR_BY,
      JSON.stringify(nearBySchedules),
    );
  } catch (e) {
    console.log('enterAction Error :', e);
  }
};

const exitAction = async (data, startTime, currentTime) => {
  try {
    const result = await AsyncStorage.getItem(KEY_VALUE_NEAR_BY);
    const nearBySchedules = JSON.parse(result);
    if (nearBySchedules.length == 0) {
      if (currentTime < startTime) {
        console.log('일정 시작 시간보다 전에 나감');
        PushNotification.cancelLocalNotification('3'); //arriveEarlyNotification 알림 사라짐
      } else {
        completeNotifHandler(data);
        await geofenceUpdate(data);
      }
    } else {
      const currentSchedule = [data[0]];
      const allNearBySchedules = currentSchedule.concat(nearBySchedules);
      const exitTimeCheck = (schedule) => currentTime > schedule.startTime;
      const isAllFinish = allNearBySchedules.every(exitTimeCheck);
      if (isAllFinish) {
        const successNumber = allNearBySchedules.length;
        await geofenceUpdate(data, true, successNumber); // 성공한 개수 만큼 async storage에서 지움
      } else {
        let successCount = 0;
        const toDoRef = dbService.collection(`${UID}`);
        allNearBySchedules.forEach((schedule) => {
          if (currentTime <= schedule.startTime) {
            successCount = successCount + 1;
          } else {
            await toDoRef.doc(`${schedule.id}`).update({ isDone: false });
            PushNotification.cancelLocalNotification(`${schedule.id}`); // 아직 isDone이 true가 아닌 일정들의 도착 알림 사라짐
            PushNotification.cancelLocalNotification(`${schedule.id} + 0`); // 완료 알림도 사라짐
          }
        });
        if (successNumber != 0) {
          await geofenceUpdate(data, true, successNumber); // 성공한 개수 만큼 async storage에서 지움
        }
      }
    }
  } catch (e) {
    console.log('exitAction Error :', e);
  }
};

const subscribeOnGeofence = async () => {
  console.log('onGeofence');
  BackgroundGeolocation.onGeofence(async (event) => {
    console.log(event.action);
    try {
      const item = await AsyncStorage.getItem(KEY_VALUE_GEOFENCE);
      const data = JSON.parse(item);
      const time = new Date();
      const hour =
        time.getHours() < 10 ? `0${time.getHours()}` : time.getHours();
      const min =
        time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
      const currentTime = `${hour}:${min}`;

      if (data.length != 0) {
        const startTime = data[0].startTime;
        const finishTime = data[0].finishTime;

        if (event.action == 'ENTER') {
          await enterAction(data, startTime, finishTime, currentTime);
        }

        if (event.action == 'EXIT') {
          await exitAction(data, startTime, currentTime);
        }
      }
    } catch (e) {
      console.log('subscribeOnGeofence Error :', e);
    }
  });
};

export const initBgGeofence = async () => {
  try {
    const state = await BackgroundGeolocation.ready({
      // Geolocation Config
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      locationAuthorizationRequest: 'Always',
      backgroundPermissionRationale: {
        // Android only
        title: '위치 서비스 이용 제한',
        message:
          '원활한 서비스 제공을 위해 위치 서비스 이용에 대한 액세스 권한을 {backgroundPermissionOptionLabel}으로 설정해주세요.',
        positiveAction: '설정',
        negativeAction: '취소',
      },
      locationAuthorizationAlert: {
        // ios only
        titleWhenNotEnabled: '위치 서비스 이용 제한',
        titleWhenOff: '위치 서비스 이용 제한',
        instructions:
          "원활한 서비스 제공을 위해 위치 서비스 이용에 대한 액세스 권한을 '항상'으로 설정해주세요.",
        settingsButton: '설정',
        cancelButton: '취소',
      },
      // Application config
      stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true, // <-- Auto start tracking when device is powered-up.
    });
    console.log('Init Geofence');
    await BackgroundGeolocation.startGeofences();
    console.log('Start Geofence');
    await subscribeOnGeofence();
    return state.didLaunchInBackground;
  } catch (e) {
    console.log('initBgGeofence Error :', e);
  }
};
