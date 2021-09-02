import BackgroundGeolocation from 'react-native-background-geolocation';
import AsyncStorage from '@react-native-community/async-storage';
import { dbService } from 'utils/firebase';
import { UID, KEY_VALUE_GEOFENCE, KEY_VALUE_TOO_EARLY } from 'constant/const';
import PushNotification from 'react-native-push-notification';
import { getEarlyTimeDiff, getLateTimeDiff } from 'utils/Time';
import {
  successNotification,
  arriveLateNotification,
  arriveEarlyNotification,
  arriveTooEarlyNotification,
  notifyNextSchedule,
} from 'utils/Notification';

const addGeofence = async (latitude, longitude) => {
  try {
    await BackgroundGeolocation.addGeofence({
      identifier: `${UID}`,
      radius: 200,
      latitude,
      longitude,
      notifyOnEntry: true,
      notifyOnExit: true,
    });
    console.log('Adding Geofence Success!!');
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
      await addGeofence(lat, lng);
    } else {
      await BackgroundGeolocation.removeGeofence(`${UID}`);
      console.log('[removeGeofence] success');
      await BackgroundGeolocation.startGeofences();
    }
  } catch (error) {
    'addGeofenceTrigger Error :', error;
  }
};

export const geofenceUpdate = async (data) => {
  try {
    await BackgroundGeolocation.stop();
    console.log('stop geolocation success');
    const toDoRef = dbService.collection(`${UID}`).doc(`${data[0].id}`);
    await toDoRef.update({ isDone: true });
    const newDataArray = data.slice(1);
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

const subscribeOnGeofence = async () => {
  console.log('onGeofence');
  BackgroundGeolocation.onGeofence(async (event) => {
    console.log(event.action);
    try {
      const item = await AsyncStorage.getItem(KEY_VALUE_GEOFENCE);
      const isTooEarly = await AsyncStorage.getItem(KEY_VALUE_TOO_EARLY);
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
          // 사용자가 지오펜스 안에 들어왔을 때
          if (startTime <= currentTime && currentTime <= finishTime) {
            const timeDiff = getLateTimeDiff(startTime, currentTime);
            if (0 <= timeDiff && timeDiff <= 10) {
              successNotification();
              await geofenceUpdate(data);
              console.log('제 시간에 옴', currentTime);
            } else {
              arriveLateNotification();
              console.log('늦은 시간에 옴', currentTime);
            }
          } else {
            const timeDiff = getEarlyTimeDiff(startTime, currentTime);
            if (0 < timeDiff && timeDiff <= 10) {
              // 일정보다 10분 내로 먼저 도착했을 경우
              arriveEarlyNotification();
              await geofenceUpdate(data);
              console.log('좀 일찍 옴', currentTime);
            } else if (timeDiff > 10) {
              arriveTooEarlyNotification(timeDiff);
              AsyncStorage.setItem(KEY_VALUE_TOO_EARLY, 'true');
              console.log('굉장히 일찍 옴', currentTime);
            }
          }
        }
        // 사용자가 10분보다 일찍 왔을 때 그 후 동작은 EXIT에 의해서 처리됨
        if (isTooEarly == 'true') {
          if (event.action == 'EXIT') {
            if (currentTime >= startTime) {
              // 사용자가 엄청 일찍 들어와서 계속 그자리에 있다가 시작 시간 이후에 나간다면 일정을 완료한 것으로 간주하고 업데이트
              console.log(
                '굉장히 일찍 와서 계속 그 위치에서 일정까지 소화하고 나감',
                currentTime,
              );
              if (data.length >= 2) {
                const nextScheduleStartTime = data[1].startTime;
                const nextScheduleLocation = data[1].location;
                notifyNextSchedule(nextScheduleStartTime, nextScheduleLocation);
              }
              await geofenceUpdate(data);
              await AsyncStorage.setItem(KEY_VALUE_TOO_EARLY, 'false');
            } else {
              // 엄청 일찍 들어와서 시작시간 전에 나갈 경우
              console.log(
                '굉장히 일찍 왔지만 일정 시작전에 나간 경우 혹은 그냥 시작 시각 전에 그 주위에 있다가 트래킹이 된 경우',
                currentTime,
              );
              PushNotification.cancelLocalNotification('4'); //arriveTooEarlyNotification 알림 사라짐
            }
          }
        }
        // else {
        //   if (event.action == 'EXIT') {
        //     if (data.length >= 2) {
        //       const nextScheduleStartTime = data[1].startTime;
        //       const nextScheduleLocation = data[1].location;
        //       notifyNextSchedule(nextScheduleStartTime, nextScheduleLocation);
        //     }
        //     //await geofenceUpdate(data);
        //   }
        // }
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
