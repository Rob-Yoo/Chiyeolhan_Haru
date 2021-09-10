import AsyncStorage from '@react-native-community/async-storage';
import {
  UID,
  KEY_VALUE_GEOFENCE,
  KEY_VALUE_NEAR_BY,
  KEY_VALUE_EARLY,
  KEY_VALUE_PROGRESSING,
} from 'constant/const';
import PushNotification from 'react-native-push-notification';
import { dbService } from 'utils/firebase';
import { geofenceUpdate } from 'utils/BgGeofence';

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

const handleAdd = async (isChangeEarliest, isEarly, nearBySchedules) => {
  try {
    const toDoRef = dbService.collection(`${UID}`);
    const geofenceData = await getDataFromAsync(KEY_VALUE_GEOFENCE);
    const progressing = await getDataFromAsync(KEY_VALUE_PROGRESSING);

    if (nearBySchedules) {
      // 일정이 현재 진행 중이라면 새로운 일정을 추가를 하면 현재 진행 중인 일정이 GEOFENCE 배열에서 사라진다.
      if (progressing == null) {
        // 현재 일정이 진행 중이 아니고 EARLY로 들어온 것만 인식된 상황이라면 각 예약된 알림들을 모두 취소한다.
        PushNotification.cancelLocalNotification(`${geofenceData[0].id} + 3`); //현재 일정 arriveEarlyNotification 알림 사라짐
        PushNotification.cancelLocalNotification(`${geofenceData[0].id} + 1`); //현재 일정 완료 알림 사라짐
      }

      if (isChangeEarliest) {
        await toDoRef.doc(`${geofenceData[1].id}`).update({ isDone: false }); // 추가되기전의 가장 이른 일정의 isDone 바꿈
      }

      for (const schedule of nearBySchedules) {
        await toDoRef.doc(`${schedule.id}`).update({ isDone: false });
        PushNotification.cancelLocalNotification(`${schedule.id}`); // nearBy 일정들의 도착 알림 사라짐
        console.log('도착 알림 사라짐');
        PushNotification.cancelLocalNotification(`${schedule.id} + 0`); // 완료 알림도 사라짐
        console.log('완료 알림 사라짐');
      }
      console.log('nearBySchedules인 경우');
      await geofenceUpdate(geofenceData, false, 0);
    } else {
      if (isEarly) {
        PushNotification.cancelLocalNotification(`${geofenceData[0].id} + 3`); //현재 일정 arriveEarlyNotification 알림 사라짐
        PushNotification.cancelLocalNotification(`${geofenceData[0].id} + 1`); //현재 일정 완료 알림 사라짐
        if (isChangeEarliest) {
          await toDoRef.doc(`${geofenceData[1].id}`).update({ isDone: false }); // 추가되기전의 가장 이른 일정 isDone 바꿈
        }
        console.log('nearBySchedule X isEarly인 경우');
        // 현재 일정 이후의 일정이라도 추가한 일정이 nearBy일 수 있기 때문에 다시 지오펜스를 킨다.
        await geofenceUpdate(geofenceData, false, 0);
      } else {
        if (isChangeEarliest) {
          // 현재 진행중인 일정에 neartBySchedules가 없고 EARLY 상태도 아니고 제일 빠른 시간의 일정이 바뀌었다면
          await geofenceUpdate(geofenceData, false, 0); // 바뀐 일정의 지오펜스로 바꿈
          console.log('nearBySchedule X isEarly X isChangeEarliest인 경우');
        }
      }
    }
  } catch (e) {
    console.log('handleAdd Error :', e);
  }
};

export const geofenceScheduler = async (isChangeEarliest, type) => {
  const isEarly = await getDataFromAsync(KEY_VALUE_EARLY);
  const nearBySchedules = await getDataFromAsync(KEY_VALUE_NEAR_BY);
  switch (type) {
    case 'ADD':
      await handleAdd(isChangeEarliest, isEarly, nearBySchedules);
      break;
    case 'EDIT':
      break;
    case 'DELTE':
      break;
    default:
      console.log('geofenceScheduler type Missing');
  }
};
