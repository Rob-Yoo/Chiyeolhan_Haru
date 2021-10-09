import AsyncStorage from '@react-native-community/async-storage';

import { cancelAllNotif } from 'utils/Notification';
import { geofenceUpdate } from 'utils/BgGeofence';
import { getCurrentTime } from 'utils/Time';
import { dbService } from 'utils/firebase';

import {
  UID,
  KEY_VALUE_GEOFENCE,
  KEY_VALUE_NEAR_BY,
  KEY_VALUE_EARLY,
  KEY_VALUE_PROGRESSING,
  KEY_VALUE_SUCCESS,
  KEY_VALUE_START_TODO,
} from 'constant/const';

const getDataFromAsync = async (storageName) => {
  try {
    const item = await AsyncStorage.getItem(storageName);
    if (item == null) {
      return null;
    } else {
      return JSON.parse(item);
    }
  } catch (e) {
    console.log('getDataFromAsync Error :', e);
  }
};

const loadSuccessSchedules = async () => {
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
          console.log('끝난 성공한 일정 사라짐: ', successSchedules);
        }
      }
    }
  } catch (e) {
    console.log('loadSuccessSchedules Error :', e);
  }
};

export const checkGeofenceSchedule = async () => {
  // 가장 최신의 지오펜스 일정 끝시간이 지났을 때 해당 일정이 성공한 일정 배열에 존재하는지 체크
  // 없으면 다음 일정으로 업데이트 해줘야한다.
  try {
    const currentTime = getCurrentTime();
    const geofenceData = await getDataFromAsync(KEY_VALUE_GEOFENCE);
    const isStartTodo = await getDataFromAsync(KEY_VALUE_START_TODO);
    const todosRef = dbService.collection(`${UID}`);
    let isNeedSkip = false;

    await loadSuccessSchedules();

    if (isStartTodo) {
      if (geofenceData) {
        if (geofenceData.length > 0) {
          if (geofenceData[0].finishTime <= currentTime) {
            const dbData = await todosRef
              .where('id', '==', geofenceData[0].id)
              .get();
            dbData.forEach((todo) => {
              if (todo.data().isDone == false) {
                isNeedSkip = 1;
              }
            });
          } else if (geofenceData[0].startTime <= currentTime) {
            const dbData = await todosRef
              .where('id', '==', geofenceData[0].id)
              .get();
            dbData.forEach((todo) => {
              if (todo.data().isDone == false) {
                isNeedSkip = 2;
              }
            });
          }
        }
      }
    }
    return isNeedSkip;
  } catch (e) {
    console.log('checkGeofenceSchedule Error :', e);
  }
};

export const geofenceScheduler = async (isChangeEarliest) => {
  try {
    const isEarly = await getDataFromAsync(KEY_VALUE_EARLY);
    const nearBySchedules = await getDataFromAsync(KEY_VALUE_NEAR_BY);
    const geofenceData = await getDataFromAsync(KEY_VALUE_GEOFENCE);
    const successSchedules = await getDataFromAsync(KEY_VALUE_SUCCESS);
    const progressing = await getDataFromAsync(KEY_VALUE_PROGRESSING);
    const isStartTodo = await getDataFromAsync(KEY_VALUE_START_TODO);

    if (nearBySchedules) {
      // 일정이 현재 진행 중이라면 새로운 일정을 추가를 하면 현재 진행 중인 일정이 GEOFENCE 배열에서 사라진다.
      if (isChangeEarliest) {
        if (progressing) {
          // progressing인 일정을 추가, 수정할 경우 geofence 배열에 넣어줘야한다.
          geofenceData.unshift(progressing);
          await AsyncStorage.setItem(
            KEY_VALUE_GEOFENCE,
            JSON.stringify(geofenceData),
          );
        }
        //추가 되기전 가장 최신 일정의 각 예약된 알림들을 모두 취소한다.
        cancelAllNotif(geofenceData[1].id);
      } else if (progressing == null) {
        // 현재 일정이 진행 중이 아니고 EARLY로 들어온 것만 인식된 상황이라면 각 예약된 알림들을 모두 취소한다.
        cancelAllNotif(geofenceData[0].id);
      }

      for (const schedule of nearBySchedules) {
        //nearBy 일정들의 각 예약된 알림들을 모두 취소한다.
        cancelAllNotif(schedule.id);
      }
      await geofenceUpdate(geofenceData, 0);
      console.log('nearBySchedules인 경우');
    } else {
      if (isEarly) {
        if (isChangeEarliest) {
          if (progressing) {
            // progressing인 일정을 추가 할 경우 geofence 배열에 넣어줘야한다.
            if (geofenceData.length > 2) {
              // 추가 하기 전 가장 최신 일정의 알림 삭제
              cancelAllNotif(geofenceData[1].id);
            }
            geofenceData.unshift(progressing);
            await AsyncStorage.setItem(
              KEY_VALUE_GEOFENCE,
              JSON.stringify(geofenceData),
            );
          } else if (geofenceData.length > 2) {
            cancelAllNotif(geofenceData[1].id);
          } else if (geofenceData.length == 1) {
            cancelAllNotif(geofenceData[0].id);
          }
        } else {
          cancelAllNotif(geofenceData[0].id);
        }
        await geofenceUpdate(geofenceData, 0);
        console.log('nearBySchedule X isEarly인 경우');
        // 현재 일정 이후의 일정이라도 추가한 일정이 nearBy일 수 있기 때문에 다시 지오펜스를 킨다.
      } else {
        if (progressing) {
          // 현재 일정 시작 시간이 지났는데 아직 안들어와서 새로운 일정을 추가한 경우
          let addProgressing = false;
          if (successSchedules) {
            const isDoneIdx = successSchedules.findIndex((schedule) => {
              if (schedule.id === progressing.id) {
                return true;
              }
            });
            // isDoneIdx가 -1이라는 뜻은 현재 일정이 성공한 일정이 아니라는 뜻으로 아직 일정 장소에 안들어왔다는 소리이다.
            if (isDoneIdx == -1) {
              addProgressing = true;
            }
          } else {
            addProgressing = true;
          }
          if (addProgressing) {
            // 아래와 같이 하는 이유는 새로운 일정을 생성하면 geofenceArray에다 DB에서 아직 시작시간이 지나지 않은 일정들만 가져온다.
            // 이런 이유 떄문에 현재 일정 시작 시간이 지났는데 아직 안들어와서 새로운 일정을 추가한 경우에는 현재 일정이 사라져버린다.
            // 따라서 이를 방지하기 위해 현재 시간이 일정의 시작시간과 끝시간 사이인 일정, 즉 현재 진행중인 일정을 progressing이라고 정의한다.
            // 이 progressing을 geofenceArray의 가장 처음으로 들어가게 해준다.
            geofenceData.unshift(progressing);
            await AsyncStorage.setItem(
              KEY_VALUE_GEOFENCE,
              JSON.stringify(geofenceData),
            );
            if (isStartTodo) {
              await geofenceUpdate(geofenceData, 0);
            }
            console.log('nearBySchedule X isEarly X Progressing인 경우');
          }
        } else if (isChangeEarliest) {
          // 현재 진행중인 일정에 neartBySchedules가 없고 도착 상태도 아니고 제일 빠른 시간의 일정이 바뀌었다.
          if (isStartTodo) {
            await geofenceUpdate(geofenceData, 0);
          }
          console.log('nearBySchedule X isEarly X isChangeEarliest인 경우');
        }
      }
    }
    console.log('geofenceData : ', geofenceData);
  } catch (e) {
    console.log('geofenceScheduler Error :', e);
  }
};
