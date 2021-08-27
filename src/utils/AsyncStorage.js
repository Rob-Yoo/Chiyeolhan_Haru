import AsyncStorage from '@react-native-community/async-storage';
import { addGeofenceTrigger } from 'utils/BgGeofence';
import { dbService } from 'utils/firebase';
import {
  TODAY,
  UID,
  KEY_VALUE_GEOFENCE,
  KEY_VALUE_SEARCHED,
} from 'constant/const';

// const setFirstSubmit = () => {
//   AsyncStorage.setItem(KEY_VALUE_GEOFENCE1, 'true');
// };

const setGeofenceData = (array) => {
  AsyncStorage.setItem(KEY_VALUE_GEOFENCE, array);
};

const setSearchedData = (array) => {
  AsyncStorage.setItem(KEY_VALUE_SEARCHED, array);
};

// export const checkFirstSubmit = async () => {
//   try {
//     const isFirstLaunched = await AsyncStorage.getItem(KEY_VALUE_GEOFENCE1);
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

export const dbToAsyncStorage = async (isChangeEarliest) => {
  try {
    const geofenceDataArray = [];
    const todosRef = dbService.collection(`${UID}`);
    const data = await todosRef
      .where('date', '==', `${TODAY}`)
      .where('isDone', '==', false)
      .get();
    data.forEach((result) => {
      console.log(result.data());
      geofenceDataArray.push({
        id: result.data().id,
        startTime: result.data().startTime,
        finishTime: result.data().finishTime,
        latitude: result.data().latitude,
        longitude: result.data().longitude,
        location: result.data().location,
      });
    });
    setGeofenceData(JSON.stringify(geofenceDataArray));
    if (isChangeEarliest) {
      await addGeofenceTrigger();
    }
  } catch (e) {
    console.log('dbToAsyncStorage Error :', e);
  }
};

export const saveSearchedData = async (searchedObject) => {
  try {
    const data = await AsyncStorage.getItem(KEY_VALUE_SEARCHED);
    if (data === null) {
      const searchedDataArray = [];
      searchedDataArray.push(searchedObject);
      setSearchedData(JSON.stringify(searchedDataArray));
    } else {
      let searchedArray = JSON.parse(data);
      searchedArray.unshift(searchedObject);
      const newSearchedArray = searchedArray;
      setSearchedData(JSON.stringify(newSearchedArray));
    }
    const newData = await AsyncStorage.getItem(KEY_VALUE_SEARCHED);
    console.log(JSON.parse(newData));
  } catch (e) {
    console.log('searchedHistory Error :', e);
  }
};

export const deleteSearchedData = async (data, updateData = false) => {
  try {
    await AsyncStorage.removeItem(KEY_VALUE_SEARCHED);
    if (updateData) {
      data.unshift(updateData);
    }
    return AsyncStorage.setItem(KEY_VALUE_SEARCHED, JSON.stringify(data));
  } catch (e) {
    console.log('deleteSearchedData Error :', e);
  }
};

export const deleteAllSearchedData = async (data) => {
  try {
    await AsyncStorage.removeItem(KEY_VALUE_SEARCHED);
    return AsyncStorage.setItem(KEY_VALUE_SEARCHED, `[]`);
  } catch (e) {
    console.log('deleteSearchedData Error :', e);
  }
};
