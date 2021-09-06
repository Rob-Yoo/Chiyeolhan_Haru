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
  KEY_VALUE_TODAY,
} from 'constant/const';
import { isEarliestTime, getCurrentTime } from 'utils/Time';

const setTomorrowData = async (array) => {
  try {
    await AsyncStorage.setItem(KEY_VALUE_TOMORROW, array);
  } catch (e) {
    console.log('setTomorrowData Error :', e);
  }
};

const setGeofenceData = async (array) => {
  try {
    await AsyncStorage.setItem(KEY_VALUE_GEOFENCE, array);
  } catch (e) {
    console.log('setGeofenceData Error :', e);
  }
};

const setTodayData = async (array) => {
  try {
    await AsyncStorage.setItem(KEY_VALUE_TODAY, array);
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

const getItemFromAsync = (storageName) => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(storageName, (err, result) => {
      if (err) {
        reject(err);
      }

      if (result === null) {
        resolve(null);
      }

      resolve(JSON.parse(result));
    });
  });
};

export const deleteTomorrowAsyncStorageData = async (id) => {
  try {
    const tomorrowData = await getItemFromAsync(KEY_VALUE_TOMORROW);
    await AsyncStorage.removeItem(KEY_VALUE_TOMORROW);
    const updateData = tomorrowData.filter((item) => item.id !== id);
    await AsyncStorage.setItem(KEY_VALUE_TOMORROW, JSON.stringify(updateData));
  } catch (e) {
    console.log('deleteTomorrowAsyncStorageData Error :', e);
  }
};

export const deleteGeofenceAsyncStorageData = async (id) => {
  try {
    const geofenceData = await getItemFromAsync(KEY_VALUE_GEOFENCE);
    await AsyncStorage.removeItem(KEY_VALUE_GEOFENCE);
    const updateGeofenceData = geofenceData.filter((item) => item.id !== id);
    await AsyncStorage.setItem(
      KEY_VALUE_GEOFENCE,
      JSON.stringify(updateGeofenceData),
    );
  } catch (e) {
    console.log('deleteGeofenceAsyncStorageData Error :', e);
  }
};

export const deleteTodayAsyncStorageData = async (id) => {
  try {
    const todayData = await getItemFromAsync(KEY_VALUE_TODAY);
    await AsyncStorage.removeItem(KEY_VALUE_TODAY);
    const updateTodayData = todayData.filter((item) => item.id !== id);
    await AsyncStorage.setItem(
      KEY_VALUE_TODAY,
      JSON.stringify(updateTodayData),
    );
  } catch (e) {
    console.log('deleteTodayAsyncStorageData Error :', e);
  }
};

export const dbToAsyncStorage = async (isChangeEarliest) => {
  try {
    const geofenceDataArray = [];
    const todayToDoArray = [];
    const todosRef = dbService.collection(`${UID}`);
    const data = await todosRef.where('date', '==', TODAY).get();
    data.forEach((result) => {
      if (result.data().finishTime > getCurrentTime()) {
        geofenceDataArray.push({
          id: result.data().id,
          startTime: result.data().startTime,
          finishTime: result.data().finishTime,
          latitude: result.data().latitude,
          longitude: result.data().longitude,
          location: result.data().location,
        });
      }
      todayToDoArray.push({
        id: result.data().id,
        startTime: result.data().startTime,
        finishTime: result.data().finishTime,
        latitude: result.data().latitude,
        longitude: result.data().longitude,
        location: result.data().location,
      });
    });
    console.log(geofenceDataArray);
    await setGeofenceData(JSON.stringify(geofenceDataArray));
    await setTodayData(JSON.stringify(todayToDoArray));
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
    // const newData = await AsyncStorage.getItem(KEY_VALUE_SEARCHED);
    // console.log(JSON.parse(newData));
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

export const deleteAllSearchedData = async () => {
  try {
    await AsyncStorage.removeItem(KEY_VALUE_SEARCHED);
    const setData = await AsyncStorage.setItem(KEY_VALUE_SEARCHED, `[]`);
    return setData;
  } catch (e) {
    console.log('deleteSearchedData Error :', e);
  }
};

export const checkEarlistTodo = async (todoStartTime) => {
  try {
    const result = await AsyncStorage.getItem(KEY_VALUE_GEOFENCE);
    if (result != null) {
      const data = JSON.parse(result);
      if (data.length != 0) {
        const earliestTime = data[0].startTime;
        if (!isEarliestTime(earliestTime, todoStartTime)) {
          return false;
        } else {
          return true;
        }
      }
    }
    return true;
  } catch (e) {
    console.log('toDoSubmit first try catch Error :', e);
  }
};
