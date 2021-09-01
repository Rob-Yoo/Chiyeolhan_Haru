import AsyncStorage from '@react-native-community/async-storage';
import { addGeofenceTrigger } from 'utils/BgGeofence';
import { dbService } from 'utils/firebase';
import {
  TODAY,
  TOMORROW,
  UID,
  KEY_VALUE_GEOFENCE,
  KEY_VALUE_SEARCHED,
  KEY_VALUE_TOMORROW,
} from 'constant/const';

// const setFirstSubmit = () => {
//   AsyncStorage.setItem(KEY_VALUE_GEOFENCE1, 'true');
// };

const setTomorrowData = async (array) => {
  try {
    await AsyncStorage.setItem(KEY_VALUE_TOMORROW, array);
  } catch (e) {
    console.log('setTomorrowData Error :', e);
  }
};

export const deleteTomorrowAsyncStorageData = async (id) => {
  try {
    const tomorrowData = await AsyncStorage.getItem(KEY_VALUE_TOMORROW);
    await AsyncStorage.removeItem(KEY_VALUE_TOMORROW);
    const updateData = tomorrowData.filter((item) => item.id !== id);
    await AsyncStorage.setItem(KEY_VALUE_TOMORROW, JSON.stringify(updateData));
  } catch (e) {
    console.log('deleteTomorrowAsyncStorageData Error :', e);
  }
};

const setGeofenceData = async (array) => {
  try {
    await AsyncStorage.setItem(KEY_VALUE_GEOFENCE, array);
  } catch (e) {
    console.log('setGeofenceData Error :', e);
  }
};

const setSearchedData = async (array) => {
  try {
    await AsyncStorage.setItem(KEY_VALUE_SEARCHED, array);
  } catch (e) {
    console.log('setSearchedData Error :', e);
  }
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
      geofenceDataArray.push({
        id: result.data().id,
        startTime: result.data().startTime,
        finishTime: result.data().finishTime,
        latitude: result.data().latitude,
        longitude: result.data().longitude,
        location: result.data().location,
      });
    });
    await setGeofenceData(JSON.stringify(geofenceDataArray));
    if (isChangeEarliest) {
      await addGeofenceTrigger();
    }
  } catch (e) {
    console.log('dbToAsyncStorage Error :', e);
  }
};

export const dbToAsyncTomorrow = async () => {
  try {
    const tomorrowDataArray = [];
    const todosRef = dbService.collection(`${UID}`);
    const data = await todosRef.where('date', '==', `${TOMORROW}`).get();
    data.forEach((result) => {
      tomorrowDataArray.push({
        id: result.data().id,
        startTime: result.data().startTime,
        finishTime: result.data().finishTime,
        latitude: result.data().latitude,
        longitude: result.data().longitude,
        location: result.data().location,
      });
    });
    await setTomorrowData(JSON.stringify(tomorrowDataArray));
  } catch (e) {
    console.log('dbToAsyncTomorrow Error :', e);
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
      await setSearchedData(JSON.stringify(newSearchedArray));
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
    const setData = await AsyncStorage.setItem(
      KEY_VALUE_SEARCHED,
      JSON.stringify(data),
    );
    return setData;
  } catch (e) {
    console.log('deleteSearchedData Error :', e);
  }
};

export const deleteAllSearchedData = async (data) => {
  try {
    await AsyncStorage.removeItem(KEY_VALUE_SEARCHED);
    const setData = await AsyncStorage.setItem(KEY_VALUE_SEARCHED, `[]`);
    return setData;
  } catch (e) {
    console.log('deleteSearchedData Error :', e);
  }
};
