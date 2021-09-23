import AsyncStorage from '@react-native-community/async-storage';
import { geofenceScheduler } from 'utils/GeofenceScheduler';
import { dbService } from 'utils/firebase';
import PushNotification from 'react-native-push-notification';
import {
  TODAY,
  TOMORROW,
  UID,
  KEY_VALUE_GEOFENCE,
  KEY_VALUE_TODAY,
  KEY_VALUE_SEARCHED,
  KEY_VALUE_TOMORROW_DATA,
  KEY_VALUE_NEAR_BY,
  KEY_VALUE_TODAY_DATA,
  KEY_VALUE_YESTERDAY_DATA,
  KEY_VALUE_PROGRESSING,
  KEY_VALUE_FAVORITE,
  KEY_VALUE_SUCCESS,
  YESTERDAY,
} from 'constant/const';
import { cancelNotification } from 'utils/Notification';
import { isEarliestTime, getCurrentTime } from 'utils/Time';

const setTomorrowData = async (array) => {
  try {
    await AsyncStorage.setItem(KEY_VALUE_TOMORROW_DATA, array);
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
    await AsyncStorage.setItem(KEY_VALUE_TODAY_DATA, array);
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

const setProgressingSchedule = async (schedule) => {
  try {
    await AsyncStorage.setItem(KEY_VALUE_PROGRESSING, schedule);
    console.log(schedule);
  } catch (e) {
    console.log('setSearchedData Error :', e);
  }
};

export const setFavoriteData = async (array) => {
  try {
    await AsyncStorage.setItem(KEY_VALUE_FAVORITE, JSON.stringify(array));
  } catch (e) {
    console.log('setFavoriteData Error :', e);
  }
};

export const getDataFromAsync = async (storageName) => {
  try {
    const item = await AsyncStorage.getItem(storageName);
    if (item == null) {
      return null;
    } else {
      return JSON.parse(item);
    }
  } catch (e) {
    console.log('getDataFromAsync Error in AsyncStorage:', e);
  }
};

export const deleteTomorrowAsyncStorageData = async (id) => {
  try {
    const tomorrowData = await getDataFromAsync(KEY_VALUE_TOMORROW_DATA);
    const newTomorrowData = tomorrowData.filter((item) => item.id !== id);
    await AsyncStorage.setItem(
      KEY_VALUE_TOMORROW_DATA,
      JSON.stringify(newTomorrowData),
    );
  } catch (e) {
    console.log('deleteTomorrowAsyncStorageData Error :', e);
  }
};

export const deleteGeofenceAsyncStorageData = async (id) => {
  try {
    const geofenceData = await getDataFromAsync(KEY_VALUE_GEOFENCE);
    const nearBySchedule = await getDataFromAsync(KEY_VALUE_NEAR_BY);

    const newGeofence = geofenceData.filter((item) => item.id !== id);

    await AsyncStorage.setItem(KEY_VALUE_GEOFENCE, JSON.stringify(newGeofence));

    if (nearBySchedule) {
      const newNearBySchedule = nearBySchedule.filter((item) => item.id !== id);
      await AsyncStorage.setItem(
        KEY_VALUE_NEAR_BY,
        JSON.stringify(newNearBySchedule),
      );
    }
  } catch (e) {
    console.log('deleteGeofenceAsyncStorageData Error :', e);
  }
};

export const deleteTodayAsyncStorageData = async (id) => {
  try {
    const todayData = await getDataFromAsync(KEY_VALUE_TODAY_DATA);
    const successSchedules = await getDataFromAsync(KEY_VALUE_SUCCESS);

    const newTodayData = todayData.filter((item) => item.id !== id);
    await AsyncStorage.setItem(
      KEY_VALUE_TODAY_DATA,
      JSON.stringify(newTodayData),
    );

    if (successSchedules) {
      const newSuccess = successSchedules.filter((item) => item.id !== id);
      await AsyncStorage.setItem(KEY_VALUE_SUCCESS, JSON.stringify(newSuccess));
      console.log('deleted Success Schedules : ', newSuccess);
    }

    cancelNotification(id); //삭제하려는 일정의 예약된 모든 알림 삭제
    PushNotification.getScheduledLocalNotifications((notif) =>
      console.log('예약된 알람 :', notif),
    );
  } catch (e) {
    console.log('deleteTodayAsyncStorageData Error :', e);
  }
};

const setTodayToDoArray = async (todayToDos) => {
  const todayToDoArray = [];
  try {
    todayToDos.forEach((todo) => {
      const targetId = todo.data().id;
      const obj = {};
      obj[targetId] = {
        id: todo.data().id,
        startTime: todo.data().startTime,
        finishTime: todo.data().finishTime,
        latitude: todo.data().latitude,
        longitude: todo.data().longitude,
        location: todo.data().location,
        date: todo.data().date,
        address: todo.data().address,
        title: todo.data().title,
        toDos: todo.data().toDos,
      };
      todayToDoArray.push(obj);
    });
    console.log('todayToDoArray : ', todayToDoArray);
    await setTodayData(JSON.stringify(todayToDoArray));
  } catch (e) {
    console.log('setTodayToDoArray Error :', e);
  }
};

const setGeofenceDataArray = async (todayToDos) => {
  const geofenceDataArray = [];
  const currentTime = getCurrentTime();
  let progressingSchedule;

  try {
    todayToDos.forEach((todo) => {
      if (
        todo.data().startTime <= currentTime &&
        currentTime <= todo.data().finishTime
      ) {
        progressingSchedule = {
          id: todo.data().id,
          latitude: todo.data().latitude,
          longitude: todo.data().longitude,
          location: todo.data().location,
          startTime: todo.data().startTime,
          finishTime: todo.data().finishTime,
        };
      }
      if (todo.data().startTime > currentTime) {
        geofenceDataArray.push({
          id: todo.data().id,
          startTime: todo.data().startTime,
          finishTime: todo.data().finishTime,
          latitude: todo.data().latitude,
          longitude: todo.data().longitude,
          location: todo.data().location,
        });
      }
    });
    console.log('geofenceDataArray : ', geofenceDataArray);
    await setGeofenceData(JSON.stringify(geofenceDataArray));
    if (progressingSchedule) {
      await setProgressingSchedule(JSON.stringify(progressingSchedule));
    }
  } catch (e) {
    console.log('setGeofenceDataArray Error :', e);
  }
};

export const dbToAsyncStorage = async (isChangeEarliest) => {
  try {
    const todosRef = dbService.collection(`${UID}`);
    const todayToDos = await todosRef.where('date', '==', TODAY).get();

    await setTodayToDoArray(todayToDos);
    await setGeofenceDataArray(todayToDos);
    await geofenceScheduler(isChangeEarliest);
  } catch (e) {
    console.log('dbToAsyncStorage Error :', e);
  }
};

export const dbToAsyncTomorrow = async () => {
  try {
    const tomorrowDataArray = [];
    const todosRef = dbService.collection(`${UID}`);
    const data = await todosRef.where('date', '==', `${TOMORROW}`).get();
    data.forEach((todo) => {
      const targetId = todo.data().id;
      const obj = {};
      obj[targetId] = {
        id: todo.data().id,
        startTime: todo.data().startTime,
        finishTime: todo.data().finishTime,
        latitude: todo.data().latitude,
        longitude: todo.data().longitude,
        location: todo.data().location,
        date: todo.data().date,
        address: todo.data().address,
        title: todo.data().title,
        toDos: todo.data().toDos,
      };
      tomorrowDataArray.push(obj);
    });
    await setTomorrowData(JSON.stringify(tomorrowDataArray));
  } catch (e) {
    console.log('dbToAsyncTomorrow Error :', e);
  }
};

export const saveSearchedData = async (searchedObject) => {
  try {
    const searchedArray = await getDataFromAsync(KEY_VALUE_SEARCHED);
    if (searchedArray == null) {
      const searchedDataArray = [];
      searchedDataArray.push(searchedObject);
      setSearchedData(JSON.stringify(searchedDataArray));
    } else {
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

export const checkTodayChange = async () => {
  try {
    let isNeedUpdate = false;
    const today = await AsyncStorage.getItem(KEY_VALUE_TODAY);

    if (today === null) {
      await AsyncStorage.setItem(KEY_VALUE_TODAY, TODAY); // TODAY 어싱크에 바뀐 오늘날짜를 저장
    } else if (today !== TODAY) {
      const tomorrowData = await AsyncStorage.getItem(KEY_VALUE_TOMORROW_DATA);
      const todayData = await AsyncStorage.getItem(KEY_VALUE_TODAY_DATA);

      await AsyncStorage.setItem(KEY_VALUE_TODAY, TODAY); // TODAY 어싱크에 바뀐 오늘날짜를 저장

      if (todayData === null) {
        await AsyncStorage.removeItem(KEY_VALUE_YESTERDAY_DATA);
      } else {
        await AsyncStorage.setItem(KEY_VALUE_YESTERDAY_DATA, todayData);
      }

      if (tomorrowData === null) {
        await AsyncStorage.removeItem(KEY_VALUE_TODAY_DATA);
        await AsyncStorage.removeItem(KEY_VALUE_GEOFENCE);
        return false;
      } else {
        // 오늘이 지나면
        // TOMORROW 데이터들을 각각 TODAY_DATA, GEOFENCE 어싱크 스토리지에 넣어놓고 비워둠.
        await AsyncStorage.setItem(KEY_VALUE_TODAY_DATA, tomorrowData);
        await AsyncStorage.setItem(KEY_VALUE_GEOFENCE, tomorrowData);
        await AsyncStorage.removeItem(KEY_VALUE_TOMORROW_DATA);
        const geofenceData = await AsyncStorage.getItem(KEY_VALUE_GEOFENCE);
        console.log('바뀐 geofenceData :', geofenceData);
        isNeedUpdate = true;
      }
    } else {
      console.log('날짜가 바뀌지 않았음');
    }
    return isNeedUpdate;
  } catch (e) {
    console.log('checkTodayChange Error :', e);
  }
};

export const checkEarlistTodo = async (todoStartTime) => {
  try {
    const data = await getDataFromAsync(KEY_VALUE_GEOFENCE);
    if (data != null) {
      if (data.length > 0) {
        const earliestTime = data[0].startTime;
        if (isEarliestTime(earliestTime, todoStartTime)) {
          return true;
        } else {
          return false;
        }
      }
    }
    return true;
  } catch (e) {
    console.log('checkEarlistTodo Error :', e);
  }
};
