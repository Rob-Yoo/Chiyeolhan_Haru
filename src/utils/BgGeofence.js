import BackgroundGeolocation from 'react-native-background-geolocation';
import AsyncStorage from '@react-native-community/async-storage';
import { dbService } from 'utils/firebase';
import { UID, KEY_VALUE_GEOFENCE, KEY_VALUE_TOO_EARLY } from 'constant/const';
import PushNotification from 'react-native-push-notification';
import { getTimeDifference } from 'utils/Time';
import {
  successNotification,
  arriveEarlyNotification,
  arriveTooEarlyNotification,
} from 'utils/Notification';

const addGeofence = (latitude, longitude) => {
  BackgroundGeolocation.addGeofence({
    identifier: `${UID}`,
    radius: 200,
    latitude,
    longitude,
    notifyOnEntry: true,
    notifyOnExit: true,
  })
    .then((success) => console.log('Adding Geofence Success!!'))
    .catch((error) => {
      console.log('addGeofence Error :', error);
    });
};

export const addGeofenceTrigger = async () => {
  try {
    const item = await AsyncStorage.getItem(KEY_VALUE_GEOFENCE);
    const data = JSON.parse(item);
    if (data.length != 0) {
      const lat = data[0].latitude;
      const lng = data[0].longitude;
      addGeofence(lat, lng);
    }
  } catch (error) {
    console.log('addGeofenceTrigger Error :', error);
  }
};

export const geofenceUpdate = (data) => {
  BackgroundGeolocation.stop()
    .then(async (success) => {
      console.log('stop geolocation success');
      try {
        const toDoRef = dbService.collection(`${UID}`).doc(`${data[0].id}`);
        await toDoRef.update({ isDone: true });
        const newDataArray = data.slice(1);
        AsyncStorage.setItem(KEY_VALUE_GEOFENCE, JSON.stringify(newDataArray));
        addGeofenceTrigger();
        BackgroundGeolocation.startGeofences();
      } catch (e) {
        console.log('geofenceUpdate Error :', e);
      }
    })
    .catch((error) => {
      console.log('geofenceUpdate Error :' + error);
    });
};

export const initBgGeofence = async () => {
  await BackgroundGeolocation.ready({
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
  }).then((state) => {
    BackgroundGeolocation.startGeofences();
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
          if (isTooEarly == 'true' && event.action == 'EXIT') {
            if (currentTime >= data[0].startTime) {
              // 사용자가 엄청 일찍 들어와서 계속 그자리에 있다가 시작 시간 이후에 나간다면 일정을 완료한 것으로 간주하고 업데이트
              console.log(
                '굉장히 일찍 와서 계속 그 위치에서 일정까지 소화하고 나감',
                currentTime,
              );
              geofenceUpdate(data);
            } else {
              // 엄청 일찍 들어와서 시작시간 전에 나갈 경우
              console.log('굉장히 일찍 왔지만 일정 시작전에 나감', currentTime);
              PushNotification.cancelLocalNotification('3'); //arriveTooEarlyNotification 알림 사라짐
            }
            AsyncStorage.setItem(KEY_VALUE_TOO_EARLY, 'false');
          }
          if (event.action == 'ENTER') {
            if (
              data[0].startTime <= currentTime &&
              data[0].finishTime >= currentTime
            ) {
              successNotification();
              console.log('제 시간에 옴', currentTime);
              geofenceUpdate(data);
            } else {
              const timeDifference = getTimeDifference(
                data[0].startTime,
                currentTime,
              );
              if (timeDifference <= 20 && timeDifference > 0) {
                // 일정보다 20분 내로 먼저 도착했을 경우
                arriveEarlyNotification();
                console.log('좀 일찍 옴', currentTime);
                geofenceUpdate(data);
              } else if (timeDifference > 20) {
                arriveTooEarlyNotification(timeDifference);
                AsyncStorage.setItem(KEY_VALUE_TOO_EARLY, 'true');
                console.log('굉장히 일찍 옴', currentTime);
              }
            }
          }
        }
      } catch (error) {
        console.log('onGeofence Error :', error);
      }
    });
  });
};
