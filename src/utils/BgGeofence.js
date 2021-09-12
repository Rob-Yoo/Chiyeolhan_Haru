import BackgroundGeolocation from 'react-native-background-geolocation';
import AsyncStorage from '@react-native-community/async-storage';
import { dbService } from 'utils/firebase';
import {
  UID,
  KEY_VALUE_GEOFENCE,
  KEY_VALUE_NEAR_BY,
  KEY_VALUE_EARLY,
  KEY_VALUE_PROGRESSING,
} from 'constant/const';
import PushNotification from 'react-native-push-notification';
import {
  getEarlyTimeDiff,
  getLateTimeDiff,
  getTimeDiff,
  getCurrentTime,
} from 'utils/Time';
import {
  completeNotification,
  notifHandler,
  arriveEarlyNotification,
} from 'utils/Notification';
import getDistance from 'haversine-distance';

const getDataFromAsync = async (storageName) => {
  try {
    const item = await AsyncStorage.getItem(storageName);
    if (item == null) {
      return null;
    } else {
      return JSON.parse(item);
    }
  } catch (e) {
    console.log('getDataFromAsync Error :', e);
  }
};

const completeNotifHandler = (data, timeDiff, schedule) => {
  if (data.length >= 2) {
    completeNotification(true, timeDiff, schedule);
  } else {
    completeNotification(false, timeDiff, schedule);
  }
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
    const data = await getDataFromAsync(KEY_VALUE_GEOFENCE);
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

    const isEarly = await getDataFromAsync(KEY_VALUE_EARLY);
    const nearBySchedules = await getDataFromAsync(KEY_VALUE_NEAR_BY);
    const progressing = await getDataFromAsync(KEY_VALUE_PROGRESSING);

    if (isSuccess) {
      const toDoRef = dbService.collection(`${UID}`).doc(`${data[0].id}`);
      await toDoRef.update({ isDone: true });
    }
    if (index > 0) {
      const newDataArray = data.slice(index);
      await AsyncStorage.setItem(
        KEY_VALUE_GEOFENCE,
        JSON.stringify(newDataArray),
      );
    }
    if (isEarly) {
      await AsyncStorage.removeItem(KEY_VALUE_EARLY);
    }
    if (nearBySchedules) {
      await AsyncStorage.removeItem(KEY_VALUE_NEAR_BY);
    }
    if (progressing) {
      await AsyncStorage.removeItem(KEY_VALUE_PROGRESSING);
    }

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
    for (const nextSchedule of nextSchedules) {
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
        break;
      } else {
        try {
          idx = idx + 1;
          await toDoRef.doc(`${nextSchedule.id}`).update({ isDone: true });
          const timeDiff = getEarlyTimeDiff(
            nextSchedule.startTime,
            currentTime,
          );
          arriveEarlyNotification(timeDiff, nextSchedule); // 각 일정들마다 도착 알림 예약
          completeNotifHandler(data, timeDiff, nextSchedule); // 각 일정들마다 완료 알림 예약
          nearBySchedules.push(nextSchedule);
        } catch (e) {
          console.log('findNearBy Error :', e);
        }
      }
    }
  }
  return nearBySchedules;
};

const enterAction = async (data, startTime, finishTime, currentTime) => {
  const toDoRef = dbService.collection(`${UID}`);
  const timeDiff = getTimeDiff(currentTime, data[0].finishTime);
  let isEarly = false;

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
    } else {
      const timeDiff = getEarlyTimeDiff(startTime, currentTime);
      console.log('일찍 옴', currentTime);
      notifHandler('EARLY', timeDiff, data[0]);
      await AsyncStorage.setItem(KEY_VALUE_EARLY, 'true');
      isEarly = true;
    }

    const nearBySchedules = await findNearBy(data, currentTime);
    console.log('nearBySchedules :', nearBySchedules);
    if (nearBySchedules.length != 0) {
      // 다음 일정 장소가 현재 일정 장소의 200m 이내에 존재히면
      await toDoRef.doc(`${data[0].id}`).update({ isDone: true });
      await AsyncStorage.setItem(
        KEY_VALUE_NEAR_BY,
        JSON.stringify(nearBySchedules),
      );
      completeNotifHandler(data, timeDiff, data[0]); // 현재 일정의 완료 알림 예약
    } else {
      // 200m 바깥에 존재하면
      if (isEarly) {
        // 일찍 왔으면 일단 isDone만 true로 바꿔주고 EXIT 시간이 일정 시작 시간보다 빠르면 false로 다시 바꿈
        await toDoRef.doc(`${data[0].id}`).update({ isDone: true });
        // 완료 알림 예약하고 EXIT 시간이 일정 시작 시간보다 빠르면 알림 취소
        completeNotifHandler(data, timeDiff, data[0]);
      } else {
        await geofenceUpdate(data);
        completeNotifHandler(data, timeDiff, data[0]);
      }
    }
  } catch (e) {
    console.log('enterAction Error :', e);
  }
};

const exitAction = async (data, startTime, currentTime) => {
  try {
    const nearBySchedules = await getDataFromAsync(KEY_VALUE_NEAR_BY);
    const toDoRef = dbService.collection(`${UID}`);

    if (nearBySchedules == null) {
      if (currentTime < startTime) {
        console.log('일정 시작 시간보다 전에 나감');
        PushNotification.cancelLocalNotification(`${data[0].id} + 3`); //현재 일정 arriveEarlyNotification 알림 사라짐
        PushNotification.cancelLocalNotification(`${data[0].id} + 4`); //현재 일정 완료 알림 사라짐
        await toDoRef.doc(`${data[0].id}`).update({ isDone: false });
      } else {
        await geofenceUpdate(data, false);
        // 일찍 ENTER하고 시작 시간 이후에 EXIT 하면 이미 isDone은 true이므로 geofence만 다음 일정꺼로 넘김
      }
    } else {
      if (!nearBySchedules.includes(data[0])) {
        nearBySchedules.unshift(data[0]);
      }
      console.log('allNearBySchedules :', nearBySchedules);
      const exitTimeCheck = (schedule) => currentTime > schedule.startTime;
      const isAllFinish = nearBySchedules.every(exitTimeCheck);
      if (isAllFinish) {
        const successNumber = nearBySchedules.length;
        console.log('successNumber :', successNumber);
        await geofenceUpdate(data, false, successNumber); // 성공한 개수 만큼 async storage에서 지움
      } else {
        let successCount = 0;
        for (const schedule of nearBySchedules) {
          if (currentTime >= schedule.startTime) {
            successCount = successCount + 1;
          } else {
            await toDoRef.doc(`${schedule.id}`).update({ isDone: false });
            console.log('isDone: false로 바뀜 :', schedule.location);
            PushNotification.cancelLocalNotification(`${schedule.id} + 3`); // nearBy 일정들의 도착 알림 사라짐
            console.log('도착 알림 사라짐');
            PushNotification.cancelLocalNotification(`${schedule.id} + 4`); // 완료 알림도 사라짐
            console.log('완료 알림 사라짐');
          }
        }
        if (successCount != 0) {
          console.log('successCount :', successCount);
          await geofenceUpdate(data, false, successCount); // 성공한 개수 만큼 async storage에서 지움
        }
      }
    }
  } catch (e) {
    console.log('exitAction Error :', e);
  }
};

const subscribeOnGeofence = async () => {
  BackgroundGeolocation.onGeofence(async (event) => {
    // console.log(event.action);
    try {
      const data = await getDataFromAsync(KEY_VALUE_GEOFENCE);

      if (data.length != 0) {
        const startTime = data[0].startTime;
        const finishTime = data[0].finishTime;

        if (event.action == 'ENTER') {
          await enterAction(data, startTime, finishTime, getCurrentTime());
        }

        if (event.action == 'EXIT') {
          await exitAction(data, startTime, getCurrentTime());
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
    await subscribeOnGeofence();
    await BackgroundGeolocation.startGeofences();
    return state.didLaunchInBackground;
  } catch (e) {
    console.log('initBgGeofence Error :', e);
  }
};
