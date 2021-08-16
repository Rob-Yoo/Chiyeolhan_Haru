import BackgroundGeolocation from 'react-native-background-geolocation';
import { UID } from 'constant/const';

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
  });
};

export const addGeofence = (latitude, longitude) => {
  BackgroundGeolocation.addGeofence({
    identifier: `${UID}`,
    radius: 200,
    latitude,
    longitude,
    notifyOnEntry: true,
    notifyOnExit: true,
    notifyOnDwell: false,
  })
    .then((success) => console.log('Adding Geofence Success!!'))
    .catch((error) => {
      console.log('Adding geofence error', error);
    });
};

export const geofenceUpdate = (data) => {
  BackgroundGeolocation.stop()
    .then((success) => {
      console.log('stop geolocation success');
      const lat = JSON.parse(data)[1].latitude;
      const lng = JSON.parse(data)[1].longitude;
      addGeofence(lat, lng);
      BackgroundGeolocation.startGeofences();
    })
    .catch((error) => {
      console.log('stop geofence fail :' + error);
    });
};
