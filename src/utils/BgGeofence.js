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

const cmpltNearByNotifHandler = (nextSchedule, idx, data, currentTime) => {
  let isLast = false;
  let nextStartTime = '';
  let nextLocation = '';
  const finishTime = nextSchedule.finishTime;
  const timeDiff = getTimeDiff(currentTime, finishTime);

  console.log('data.length :', data.length);
  if (data.length - 1 == idx) {
    isLast = true;
  } else {
    nextStartTime = data[idx + 1].startTime;
    nextLocation = data[idx + 1].location;
  }
  completeNearbyNotif(isLast, data, idx, nextStartTime, nextLocation, timeDiff);
  console.log('완료 알림 예약 :', data[idx].location);
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
    console.log('Adding Geofence Success!!', data[0].location);
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
  let idx = 0;
  const currentScheduleLocation = {
    lat: data[0].latitude,
    lon: data[0].longitude,
  };
  const toDoRef = dbService.collection(`${UID}`);
  const nextSchedules = data.slice(1);

  if (nextSchedules.length != 0) {
    nextSchedules.forEach(async (nextSchedule) => {
      console.log('nextSchedule :', nextSchedule.location);
      const nextScheduleLocation = {
        lat: nextSchedule.latitude,
        lon: nextSchedule.longitude,
      };
      const distance = getDistance(
        currentScheduleLocation,
        nextScheduleLocation,
      );
      console.log(distance);
      if (distance > 200) {
        return;
      } else {
        try {
          idx = idx + 1;
          await toDoRef.doc(`${nextSchedule.id}`).update({ isDone: true });
          const timeDiff = getEarlyTimeDiff(
            nextSchedule.startTime,
            currentTime,
          );
          nearByNotification(nextSchedule.id, timeDiff); // 각 일정들마다 도착 알림 예약
          console.log('idx :', idx);
          cmpltNearByNotifHandler(nextSchedule, idx, data, currentTime); // 각 일정들마다 완료 알림 예약
          nearBySchedules.push(nextSchedule);
          console.log('nearBySchedules First:', nearBySchedules);
        } catch (e) {
          console.log('findNearBy Error :', e);
        }
      }
    });
  }
  console.log('nearBySchedules Second:', nearBySchedules);
  return nearBySchedules;
};

const enterAction = async (data, startTime, finishTime, currentTime) => {
  try {
    if (startTime <= currentTime && currentTime < finishTime) {
      const timeDiff = getLateTimeDiff(startTime, currentTime);
      if (0 <= timeDiff && timeDiff <= 5) {
        console.log('제 시간에 옴', currentTime);
        notifHandler('ON_TIME');
      } else {
        console.log('늦게 옴', currentTime);
        notifHandler('LATE');
      }
    } else if (currentTime >= finishTime) {
      console.log('일정 끝시간보다 늦게 옴', currentTime);
      notifHandler('FAIL');
      await geofenceUpdate(data, false); // isDone으로 안바꾸고 다음 지오펜스 업데이트
      return;
    } else {
      const timeDiff = getEarlyTimeDiff(startTime, currentTime);
      console.log('일찍 옴', currentTime);
      notifHandler('EARLY', timeDiff);
    }

    const nearBySchedules = await findNearBy(data, currentTime);
    console.log('nearBySchedules Third:', nearBySchedules);
    if (nearBySchedules.length != 0) {
      // 다음 일정 장소가 현재 일정 장소의 200m 이내에 존재히면
      const toDoRef = dbService.collection(`${UID}`);
      const timeDiff = getTimeDiff(currentTime, data[0].finishTime);
      completeNearbyNotif(
        false,
        data,
        0,
        data[1].startTime,
        data[1].location,
        timeDiff,
      ); // 현재 일정의 완료 알림 예약
      await toDoRef.doc(`${data[0].id}`).update({ isDone: true });
      await AsyncStorage.setItem(
        KEY_VALUE_NEAR_BY,
        JSON.stringify(nearBySchedules),
      );
    }
  } catch (e) {
    console.log('enterAction Error :', e);
  }
};

const exitAction = async (data, startTime, currentTime) => {
  try {
    const result = await AsyncStorage.getItem(KEY_VALUE_NEAR_BY);

    if (result == null) {
      if (currentTime < startTime) {
        console.log('일정 시작 시간보다 전에 나감');
        PushNotification.cancelLocalNotification('3'); //arriveEarlyNotification 알림 사라짐
      } else {
        completeNotifHandler(data);
        await geofenceUpdate(data);
      }
    } else {
      const nearBySchedules = JSON.parse(result);
      let allNearBySchedules = [];
      const currentSchedule = [data[0]];
      if (currentSchedule[0] == nearBySchedules[0]) {
        // 사용자가 현재 일정의 끝시간 이후에 새로운 일정을 추가하면 data[0]이 현재 일정이 아니라 다음 일정이 된 상태임....
        allNearBySchedules = nearBySchedules;
      } else {
        allNearBySchedules = currentSchedule.concat(nearBySchedules);
      }
      console.log('allNearBySchedules :', allNearBySchedules);
      const exitTimeCheck = (schedule) => currentTime > schedule.startTime;
      const isAllFinish = allNearBySchedules.every(exitTimeCheck);
      if (isAllFinish) {
        const successNumber = allNearBySchedules.length;
        console.log('successNumber :', successNumber);
        await geofenceUpdate(data, false, successNumber); // 성공한 개수 만큼 async storage에서 지움
      } else {
        let successCount = 0;
        const toDoRef = dbService.collection(`${UID}`);
        allNearBySchedules.forEach(async (schedule) => {
          if (currentTime <= schedule.startTime) {
            successCount = successCount + 1;
          } else {
            await toDoRef.doc(`${schedule.id}`).update({ isDone: false });
            console.log('isDone: false로 바뀜 :', schedule.location);
            PushNotification.cancelLocalNotification(`${schedule.id}`); // 아직 isDone이 true가 아닌 일정들의 도착 알림 사라짐
            console.log('도착 알림 사라짐');
            PushNotification.cancelLocalNotification(`${schedule.id} + 0`); // 완료 알림도 사라짐
            console.log('완료 알림 사라짐');
          }
        });
        if (successNumber != 0) {
          console.log('successNumber :', successNumber);
          await geofenceUpdate(data, false, successNumber); // 성공한 개수 만큼 async storage에서 지움
        }
      }
      await AsyncStorage.removeItem(KEY_VALUE_NEAR_BY);
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
