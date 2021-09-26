import BackgroundGeolocation from 'react-native-background-geolocation';
import AsyncStorage from '@react-native-community/async-storage';
import PushNotification from 'react-native-push-notification';
import getDistance from 'haversine-distance';

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
  failNotification,
  cancelNotification,
} from 'utils/Notification';

import {
  UID,
  KEY_VALUE_GEOFENCE,
  KEY_VALUE_NEAR_BY,
  KEY_VALUE_EARLY,
  KEY_VALUE_PROGRESSING,
  KEY_VALUE_SUCCESS,
} from 'constant/const';

const getDataFromAsync = async (storageName) => {
  try {
    const item = await AsyncStorage.getItem(storageName);
    if (item == null) {
      return null;
    } else {
      return JSON.parse(item);
    }
  } catch (e) {
    console.log('getDataFromAsync in BgGeofence Error :', e);
  }
};

const setSuccessSchedule = async (array) => {
  try {
    await AsyncStorage.setItem(KEY_VALUE_SUCCESS, JSON.stringify(array));
  } catch (e) {
    console.log('setTomorrowData Error :', e);
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

const addGeofenceTrigger = async () => {
  try {
    const data = await getDataFromAsync(KEY_VALUE_GEOFENCE);
    if (data.length > 0) {
      const lat = data[0].latitude;
      const lng = data[0].longitude;
      await addGeofence(lat, lng, data);
      await BackgroundGeolocation.startGeofences();
    } else {
      await BackgroundGeolocation.removeGeofence(`${UID}`);
      console.log('[removeGeofence] success');
      await BackgroundGeolocation.stop();
      console.log('stop geofence tracking');
    }
  } catch (error) {
    'addGeofenceTrigger Error :', error;
  }
};

export const geofenceUpdate = async (data, index = 1) => {
  try {
    await BackgroundGeolocation.stop();

    const isEarly = await getDataFromAsync(KEY_VALUE_EARLY);
    const nearBySchedules = await getDataFromAsync(KEY_VALUE_NEAR_BY);
    const progressing = await getDataFromAsync(KEY_VALUE_PROGRESSING);

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
  const nextSchedules = data.slice(1);

  if (nextSchedules.length > 0) {
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
          const timeDiff = getEarlyTimeDiff(
            nextSchedule.startTime,
            currentTime,
          );
          arriveEarlyNotification(timeDiff, nextSchedule); // 각 일정들마다 도착 알림 예약
          completeNotification(timeDiff, nextSchedule); // 각 일정들마다 완료 알림 예약
          PushNotification.cancelLocalNotification(`${nextSchedule.id}F`); // failNotif 알림 취소
          await saveSuccessSchedules(nextSchedule.id, nextSchedule.startTime); // 일단 성공한 일정으로 취급
          nearBySchedules.push(nextSchedule);
        } catch (e) {
          console.log('findNearBy Error :', e);
        }
      }
    }
  }
  return nearBySchedules;
};

const saveSuccessSchedules = async (id, startTime, finishTime) => {
  try {
    const successSchedules = await getDataFromAsync(KEY_VALUE_SUCCESS);
    if (successSchedules === null) {
      const schedule = [{ id, startTime, finishTime }];
      await setSuccessSchedule(schedule);
    } else {
      let isOverlap = false;

      for (const schedule of successSchedules) {
        if (schedule.id === id) {
          isOverlap = true;
          break;
        }
      }
      if (!isOverlap) {
        successSchedules.push({ id, startTime, finishTime });
        await setSuccessSchedule(successSchedules);
      }
    }
  } catch (e) {
    console.log('saveSuccessSchedules Error :', e);
  }
};

const enterAction = async (data, startTime, finishTime, currentTime) => {
  const timeDiff = getTimeDiff(currentTime, data[0].finishTime);
  let isEarly = false;

  try {
    if (startTime <= currentTime && currentTime <= finishTime) {
      const timeDiff = getLateTimeDiff(startTime, currentTime);
      if (0 <= timeDiff && timeDiff <= 5) {
        console.log('제 시간에 옴', currentTime);
        notifHandler('ON_TIME', data[0]); // notifHandler 함수 안에서 fail 알림을 삭제함
      } else {
        console.log('늦게 옴', currentTime);
        notifHandler('LATE', data[0]);
      }
    } else {
      const timeDiff = getEarlyTimeDiff(startTime, currentTime);
      console.log('일찍 옴', currentTime);
      notifHandler('EARLY', data[0], timeDiff);
      await AsyncStorage.setItem(KEY_VALUE_EARLY, 'true');
      isEarly = true;
    }
    completeNotification(timeDiff, data[0]); // 현재 일정의 완료 알림 예약

    const nearBySchedules = await findNearBy(data, currentTime);
    console.log('nearBySchedules :', nearBySchedules);
    if (nearBySchedules.length > 0) {
      // 다음 일정 장소가 현재 일정 장소의 200m 이내에 존재히면
      await AsyncStorage.setItem(
        KEY_VALUE_NEAR_BY,
        JSON.stringify(nearBySchedules),
      );
    } else {
      // 200m 바깥에 존재하면
      if (!isEarly) {
        // 일찍 온게 아니라면 다음 일정으로 업데이트
        await geofenceUpdate(data);
      }
      // 일찍 온 것이라면 일단 성공한 일정으로 취급하고 완료 알림 예약
      // 시작시간보다 일찍 나갔다면 성공한 일정 배열에서 제외하고 모든 알림 삭제
    }
    await saveSuccessSchedules(
      data[0].id,
      data[0].startTime,
      data[0].finishTime,
    ); // 성공한 일정 저장
    PushNotification.getScheduledLocalNotifications((notif) =>
      console.log('예약된 알람 :', notif),
    );
  } catch (e) {
    console.log('enterAction Error :', e);
  }
};

const exitAction = async (data, startTime, finishTime, currentTime) => {
  try {
    const nearBySchedules = await getDataFromAsync(KEY_VALUE_NEAR_BY);
    let successSchedules = await getDataFromAsync(KEY_VALUE_SUCCESS);

    if (nearBySchedules == null) {
      if (currentTime < startTime) {
        const timeDiff = getTimeDiff(currentTime, finishTime);
        console.log('일정 시작 시간보다 전에 나감');
        cancelNotification(data[0].id); //현재 일정의 예약된 모든 알림 삭제
        failNotification(timeDiff, data[0].id); // 다시 해당 일정의 failNotification 알림 등록
        successSchedules = successSchedules.filter(
          (schedule) => schedule.id !== data[0].id,
        ); // 성공한 일정 배열에서 삭제
        await setSuccessSchedule(successSchedules);
        await AsyncStorage.removeItem(KEY_VALUE_EARLY);
      } else {
        // 일찍 ENTER하고 시작 시간 이후에 할때
        await geofenceUpdate(data);
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
        await geofenceUpdate(data, successNumber); // 성공한 개수 만큼 async storage에서 지움
      } else {
        let successCount = 0;
        let timeDiff;
        for (const schedule of nearBySchedules) {
          if (currentTime >= schedule.startTime) {
            successCount = successCount + 1;
          } else {
            successSchedules = successSchedules.filter(
              (success) => success.id !== schedule.id,
            ); // 성공한 일정 배열에서 삭제함
            cancelNotification(schedule.id); //nearBy 일정들의 예약된 모든 알림 삭제
            timeDiff = getTimeDiff(currentTime, schedule.finishTime);
            failNotification(timeDiff, schedule.id); // 다시 nearBy 일정들의 failNotification 알림 등록
          }
        }
        if (successCount > 0) {
          console.log('successCount :', successCount);
          await geofenceUpdate(data, successCount); // 성공한 개수 만큼 async storage에서 지움
        } else {
          await AsyncStorage.removeItem(KEY_VALUE_EARLY);
        }
        console.log('Updated SuccessSchedules : ', successSchedules);
        await setSuccessSchedule(successSchedules);
      }
    }
  } catch (e) {
    console.log('exitAction Error :', e);
  }
};

export const subscribeOnGeofence = () => {
  BackgroundGeolocation.onGeofence(async (event) => {
    try {
      const data = await getDataFromAsync(KEY_VALUE_GEOFENCE);
      if (data.length > 0) {
        const startTime = data[0].startTime;
        const finishTime = data[0].finishTime;

        if (event.action == 'ENTER') {
          await enterAction(data, startTime, finishTime, getCurrentTime());
        }

        if (event.action == 'EXIT') {
          await exitAction(data, startTime, finishTime, getCurrentTime());
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

    return state.didLaunchInBackground;
  } catch (e) {
    console.log('initBgGeofence Error :', e);
  }
};
