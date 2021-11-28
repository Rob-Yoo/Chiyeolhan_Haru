import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundGeolocation from 'react-native-background-geolocation';
import PushNotification from 'react-native-push-notification';

import { geofenceDataModel, todoAsyncModel } from 'model/dataModel';

import { geofenceScheduler } from 'utils/gfSchedulerUtil';
import { dbService } from 'utils/firebaseUtil';
import {
  cancelAllNotif,
  startNotification,
  tmwStartNotification,
} from 'utils/notificationUtil';
import {
  isEarliestTime,
  getCurrentTime,
  getDate,
  getDiffMinutes,
  stringTimeToTomorrowDate,
} from 'utils/timeUtil';
import { errorNotifAlert } from 'utils/buttonAlertUtil';

import {
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
  KEY_VALUE_DAY_CHANGE,
  KEY_VALUE_START_TODO,
} from 'constant/const';

import toDoReducer, { updateIsDone } from 'redux/store';

const setTomorrowData = async (array) => {
  try {
    await AsyncStorage.setItem(KEY_VALUE_TOMORROW_DATA, array);
  } catch (e) {
    errorNotifAlert(`setTomorrowData Error : ${e}`);
  }
};

const setGeofenceData = async (array) => {
  try {
    await AsyncStorage.setItem(KEY_VALUE_GEOFENCE, array);
  } catch (e) {
    errorNotifAlert(`setGeofenceData Error : ${e}`);
  }
};

const setTodayData = async (array) => {
  try {
    await AsyncStorage.setItem(KEY_VALUE_TODAY_DATA, array);
  } catch (e) {
    errorNotifAlert(`setGeofenceData Error : ${e}`);
  }
};

const setSearchedData = async (array) => {
  try {
    await AsyncStorage.setItem(KEY_VALUE_SEARCHED, array);
  } catch (e) {
    errorNotifAlert(`setSearchedData Error : ${e}`);
  }
};

const setProgressingSchedule = async (schedule) => {
  try {
    await AsyncStorage.setItem(KEY_VALUE_PROGRESSING, schedule);
  } catch (e) {
    errorNotifAlert(`setSearchedData Error : ${e}`);
  }
};

export const setFavoriteData = async (array) => {
  try {
    await AsyncStorage.setItem(KEY_VALUE_FAVORITE, JSON.stringify(array));
  } catch (e) {
    errorNotifAlert(`setFavoriteData Error : ${e}`);
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
    errorNotifAlert(`getDataFromAsync Error in AsyncStorage : ${e}`);
  }
};

export const deleteTomorrowAsyncStorageData = async (id) => {
  try {
    const tomorrowData = await getDataFromAsync(KEY_VALUE_TOMORROW_DATA);
    const newTomorrowData = tomorrowData.filter((item) => {
      const scheduleID = Object.keys(item);
      return item[scheduleID].id !== id;
    });
    if (newTomorrowData.length === 0 || newTomorrowData === null) {
      PushNotification.cancelLocalNotification('T');
    }
    await AsyncStorage.setItem(
      KEY_VALUE_TOMORROW_DATA,
      JSON.stringify(newTomorrowData),
    );
  } catch (e) {
    errorNotifAlert(`deleteTomorrowAsyncStorageData Error : ${e}`);
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
    errorNotifAlert(`deleteGeofenceAsyncStorageData Error : ${e}`);
  }
};

export const deleteTodayAsyncStorageData = async (id) => {
  try {
    const todayData = await getDataFromAsync(KEY_VALUE_TODAY_DATA);
    const successSchedules = await getDataFromAsync(KEY_VALUE_SUCCESS);
    const newTodayData = todayData.filter((item) => {
      const scheduleID = Object.keys(item);
      return item[scheduleID].id !== id;
    });
    await AsyncStorage.setItem(
      KEY_VALUE_TODAY_DATA,
      JSON.stringify(newTodayData),
    );

    if (successSchedules) {
      const newSuccess = successSchedules.filter((item) => item.id !== id);
      await AsyncStorage.setItem(KEY_VALUE_SUCCESS, JSON.stringify(newSuccess));
      // console.log('deleted Success Schedules : ', newSuccess);
    }

    cancelAllNotif(id); //삭제하려는 일정의 예약된 모든 알림 삭제
    // PushNotification.getScheduledLocalNotifications((notif) =>
    //   console.log('예약된 알람 :', notif),
    // );
  } catch (e) {
    errorNotifAlert(`deleteTodayAsyncStorageData Error : ${e}`);
  }
};

const setTodayToDoArray = async (todayToDos) => {
  const todayToDoArray = [];
  try {
    todayToDos.forEach((todo) => {
      const targetId = todo.data().id;
      const obj = {};
      obj[targetId] = todoAsyncModel(todo.data());
      todayToDoArray.push(obj);
    });
    // console.log('todayToDoArray : ', todayToDoArray);
    await setTodayData(JSON.stringify(todayToDoArray));
  } catch (e) {
    errorNotifAlert(`setTodayToDoArray Error : ${e}`);
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
        currentTime < todo.data().finishTime &&
        todo.data().isSkip === false
      ) {
        progressingSchedule = geofenceDataModel(todo.data());
      }
      if (todo.data().startTime > currentTime) {
        geofenceDataArray.push(geofenceDataModel(todo.data()));
      }
    });
    await setGeofenceData(JSON.stringify(geofenceDataArray));
    if (progressingSchedule) {
      await setProgressingSchedule(JSON.stringify(progressingSchedule));
    }
  } catch (e) {
    errorNotifAlert(`setGeofenceDataArray Error : ${e}`);
  }
};

export const dbToAsyncStorage = async (isChangeEarliest = null) => {
  try {
    const { TODAY } = getDate();
    const todosRef = dbService.collection(`${UID}`);
    const todayToDos = await todosRef.where('date', '==', TODAY).get();

    await setTodayToDoArray(todayToDos);
    await setGeofenceDataArray(todayToDos);
    if (isChangeEarliest !== null) {
      await geofenceScheduler(isChangeEarliest);
    }
  } catch (e) {
    errorNotifAlert(`dbToAsyncStorage Error : ${e}`);
  }
};

export const dbToAsyncTomorrow = async () => {
  try {
    const { TOMORROW } = getDate();
    const tomorrowDataArray = [];
    const todosRef = dbService.collection(`${UID}`);
    const data = await todosRef.where('date', '==', `${TOMORROW}`).get();
    let n = 0;
    let startTime;
    data.forEach((todo) => {
      const targetId = todo.data().id;
      const obj = {};
      if (n === 0) {
        startTime = todo.data().startTime;
        n = n + 1;
      }
      obj[targetId] = todoAsyncModel(todo.data());
      tomorrowDataArray.push(obj);
    });
    await setTomorrowData(JSON.stringify(tomorrowDataArray));

    const timeDiff = getDiffMinutes(
      stringTimeToTomorrowDate(startTime).getTime() - new Date().getTime(),
    );
    console.log(timeDiff);
    tmwStartNotification(timeDiff);
  } catch (e) {
    errorNotifAlert(`dbToAsyncTomorrow Error : ${e}`);
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
  } catch (e) {
    errorNotifAlert(`searchedHistory Error : ${e}`);
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
    errorNotifAlert(`deleteSearchedData Error : ${e}`);
  }
};

export const deleteAllSearchedData = async () => {
  try {
    await AsyncStorage.removeItem(KEY_VALUE_SEARCHED);
    const setData = await AsyncStorage.setItem(KEY_VALUE_SEARCHED, `[]`);
    return setData;
  } catch (e) {
    errorNotifAlert(`deleteSearchedData Error : ${e}`);
  }
};

export const checkDayChange = async () => {
  try {
    const today = await AsyncStorage.getItem(KEY_VALUE_TODAY);
    const { TODAY } = getDate();

    if (today === null) {
      // 맨처음 설치되었을 떄
      await AsyncStorage.setItem(KEY_VALUE_TODAY, TODAY); // TODAY 어싱크에 바뀐 오늘날짜를 저장
      await AsyncStorage.setItem(KEY_VALUE_DAY_CHANGE, 'true');
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
      } else {
        // 오늘이 지나면
        // TOMORROW 데이터들을 각각 TODAY_DATA, GEOFENCE 어싱크 스토리지에 넣어놓고 비워둠.
        await dbToAsyncStorage();

        const geofenceData = await getDataFromAsync(KEY_VALUE_GEOFENCE);
        const progressing = await getDataFromAsync(KEY_VALUE_PROGRESSING);

        if (progressing) {
          geofenceData.unshift(progressing);
          await AsyncStorage.setItem(
            KEY_VALUE_GEOFENCE,
            JSON.stringify(geofenceData),
          );
        }
        //12시 15분껄만들고
        const currentTime = getCurrentTime();
        if (geofenceData.length > 0) {
          PushNotification.cancelLocalNotification('T');
          const timeDiff = getTimeDiff(currentTime, geofenceData[0].startTime);
          // const timeDiff = getDiffMinutes(
          //   stringTimeToTomorrowDate(geofenceData[0].startTime) - new Date(),
          // );
          // console.log(timeDiff);

          startNotification(timeDiff, geofenceData[0].id); // 첫 일정에 시작 버튼 눌러달라는 알림 예약
        }
        await AsyncStorage.removeItem(KEY_VALUE_TOMORROW_DATA);
      }
      // 성공한 일정 배열을 초기화해준다.
      await AsyncStorage.setItem(KEY_VALUE_SUCCESS, '[]');
      await AsyncStorage.setItem(KEY_VALUE_DAY_CHANGE, 'true');
      await AsyncStorage.setItem(KEY_VALUE_START_TODO, 'false'); // 날짜가 바뀌면 바뀐 일정들이 아직 시작이 안됬으므로 false로 바꿔준다.

      // 트래킹이 되고있는 일정이 남아있을 수 있기 때문에 멈춰준다.
      const geofences = await BackgroundGeolocation.getGeofences();
      if (geofences.length > 0) {
        await BackgroundGeolocation.removeGeofence(`${UID}`);
        await BackgroundGeolocation.stop();
      }
      return true;
    }
    return false;
  } catch (e) {
    errorNotifAlert(`checkDayChange Error : ${e}`);
  }
};

export const checkEarlistTodo = async (todoStartTime) => {
  try {
    const data = await getDataFromAsync(KEY_VALUE_GEOFENCE);
    if (data !== null) {
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
    errorNotifAlert(`checkEarlistTodo Error : ${e}`);
  }
};

export const loadSuccessSchedules = async () => {
  try {
    let successSchedules = await getDataFromAsync(KEY_VALUE_SUCCESS);
    let isNeedUpdate = false;
    const currentTime = getCurrentTime();
    const todosRef = dbService.collection(`${UID}`);

    if (successSchedules !== null) {
      if (successSchedules.length > 0) {
        for (const schedule of successSchedules) {
          if (schedule.startTime <= currentTime) {
            await todosRef.doc(`${schedule.id}`).update({ isDone: true });
            //리덕스 업데이트
            toDoReducer.dispatch(updateIsDone(schedule.id));
            successSchedules = successSchedules.filter(
              (success) => success.id !== schedule.id,
            ); // isDone이 true가 되면 삭제
            isNeedUpdate = true;
          }
        }
        if (isNeedUpdate) {
          await AsyncStorage.setItem(
            KEY_VALUE_SUCCESS,
            JSON.stringify(successSchedules),
          );
          // console.log('끝난 성공한 일정 사라짐: ', successSchedules);
        }
      }
    }
  } catch (e) {
    errorNotifAlert(`loadSuccessSchedules Error : ${e}`);
  }
};
