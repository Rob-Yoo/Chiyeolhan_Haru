import AsyncStorage from '@react-native-community/async-storage';
import { KEY_VALUE } from 'constant/const';
import { addGeofenceTrigger } from 'utils/BgGeofence';

// const setFirstSubmit = () => {
//   AsyncStorage.setItem(KEY_VALUE1, 'true');
// };

const setGeofenceData = (array) => {
  AsyncStorage.setItem(KEY_VALUE, array);
};

// export const checkFirstSubmit = async () => {
//   try {
//     const isFirstLaunched = await AsyncStorage.getItem(KEY_VALUE1);
//     if (isFirstLaunched === null) {
//       setFirstSubmit();
//       return true;
//     }
//     return false;
//   } catch (error) {
//     console.log(' [add first geofence] :' + error);
//     return false;
//   }
// };

export const dbToAsyncStorage = async (todosRef, today) => {
  try {
    const geofenceDataArray = [];
    const sortedByStartTime = await todosRef
      .where('date', '==', `${today}`)
      .where('isdone', '==', false)
      .get();
    sortedByStartTime.forEach((result) => {
      geofenceDataArray.push({
        id: result.data().id,
        startTime: result.data().starttime,
        finishTime: result.data().finishtime,
        latitude: result.data().latitude,
        longitude: result.data().longitude,
      });
    });
    setGeofenceData(JSON.stringify(geofenceDataArray));
    addGeofenceTrigger();
  } catch (e) {
    console.log('dbToAsyncStorage Error :', e);
  }
};
