import BackgroundGeolocation from 'react-native-background-geolocation';
import AsyncStorage from '@react-native-community/async-storage';
import { dbService } from 'utils/firebase';
import { UID, KEY_VALUE_GEOFENCE } from 'constant/const';
import { getTimeDifference } from 'utils/Time';

const addGeofence = (latitude, longitude) => {
  BackgroundGeolocation.addGeofence({
    identifier: `${UID}`,
    radius: 200,
    latitude,
    longitude,
    notifyOnEntry: true,
    notifyOnExit: true,
    loiteringDelay: 30000,
    notifyOnDwell: true,
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
        await toDoRef.update({ isdone: true });
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
        const data = JSON.parse(item);
        const time = new Date();
        const hour =
          time.getHours() < 10 ? `0${time.getHours()}` : time.getHours();
        const min =
          time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
        const currentTime = `${hour}:${min}`;
        if (data.length != 0) {
          if (data[0].startTime <= currentTime) {
            console.log(currentTime);
            geofenceUpdate(data);
          } else {
            const timeDifference = getTimeDifference(
              data[0].startTime,
              currentTime,
            );
            if (timeDifference <= 20) {
              console.log(data[0].startTime);
              geofenceUpdate(data);
            }
          }
        }
      } catch (error) {
        console.log('onGeofence Error :', error);
      }
    });
  });
};
