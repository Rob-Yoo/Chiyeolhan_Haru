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
import { geofenceUpdate, addGeofenceTrigger } from 'utils/BgGeofence';
import { getCurrentTime } from 'utils/Time';
import getDistance from 'haversine-distance';

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

    if (nearBySchedules) {
      if (isEarly) {
        PushNotification.cancelLocalNotification('3'); //arriveEarlyNotification 알림 사라짐
        PushNotification.cancelLocalNotification(`${geofenceData[0].id} + 1`); //현재 일정 완료 알림 사라짐
        if (isChangeEarliest) {
          await toDoRef.doc(`${geofenceData[1].id}`).update({ isDone: false }); // 추가되기전의 가장 이른 일정의 isDone 바꿈
        } else {
          // 현재 일정 이후의 일정이라도 추가한 일정이 nearBy일 수 있기 때문에
          await toDoRef.doc(`${geofenceData[0].id}`).update({ isDone: false }); // isDone 바꿔주고 다시 지오펜스를 킨다.
        }
        for (const schedule of nearBySchedules) {
          await toDoRef.doc(`${schedule.id}`).update({ isDone: false });
          PushNotification.cancelLocalNotification(`${schedule.id}`); // nearBy 일정들의 도착 알림 사라짐
          console.log('도착 알림 사라짐');
          PushNotification.cancelLocalNotification(`${schedule.id} + 0`); // 완료 알림도 사라짐
          console.log('완료 알림 사라짐');
        }
        await geofenceUpdate(geofenceData, false, 0);
      } else {
        // 이미 현재 일정이 진행 중인 경우이므로 isChangeEarliest는 항상 false
        // 일정이 현재 진행 중이라면 새로운 일정을 추가를 하면 현재 진행 중인 일정이 GEOFENCE 배열에서 사라진다.
        const currentTime = getCurrentTime();
        let completeCount = 0;
        for (const schedule of nearBySchedules) {
          if (currentTime < schedule.startTime) {
            await toDoRef.doc(`${schedule.id}`).update({ isDone: false });
            PushNotification.cancelLocalNotification(`${schedule.id}`); // nearBy 일정들의 도착 알림 사라짐
            console.log('도착 알림 사라짐');
            PushNotification.cancelLocalNotification(`${schedule.id} + 0`); // 완료 알림도 사라짐
            console.log('완료 알림 사라짐');
          } else {
            completeCount = completeCount + 1;
          }
        }
        await geofenceUpdate(geofenceData, false, completeCount); // 완료 혹은 진행 중인 일정들만큼 뛰어넘어서 업데이트
      }
    } else {
      if (isEarly) {
        PushNotification.cancelLocalNotification('3'); //arriveEarlyNotification 알림 사라짐
        PushNotification.cancelLocalNotification(`${geofenceData[0].id} + 1`); //현재 일정 완료 알림 사라짐
        if (isChangeEarliest) {
          await toDoRef.doc(`${geofenceData[1].id}`).update({ isDone: false }); // 추가되기전의 가장 이른 일정의 isDone 바꿈
        } else {
          // 현재 일정 이후의 일정이라도 추가한 일정이 nearBy일 수 있기 때문에
          await toDoRef.doc(`${geofenceData[0].id}`).update({ isDone: false }); // isDone 바꿔주고 다시 지오펜스를 킨다.
        }
        await geofenceUpdate(geofenceData, false, 0);
      } else {
        const progressing = await getDataFromAsync(KEY_VALUE_PROGRESSING);
        if (isChangeEarliest) {
          // 현재 진행중인 일정에 neartBySchedules가 없고 EARLY 상태도 아니고 제일 빠른 시간의 일정이 바뀌었다면
          await addGeofenceTrigger(); // 바뀐 일정의 지오펜스로 바꿈
        }
        if (progressing) {
          // 일정이 현재 진행 중이라면 새로운 일정을 추가를 하면 현재 진행 중인 일정이 GEOFENCE 배열에서 사라진다.
          // 따라서 이에 대한 처리가 다음과 같다.
          const newScheduleLocation = {
            lat: data[0].latitude,
            lon: data[0].longitude,
          };
          const progressingLocation = {
            lat: progressing.latitude,
            lon: progressing.longitude,
          };
          const distance = getDistance(
            newScheduleLocation,
            progressingLocation,
          );
          if (distance <= 200) {
            await geofenceUpdate(geofenceData, false, 0);
            await AsyncStorage.removeItem(KEY_VALUE_PROGRESSING);
          }
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
      console.log('geofenceScheduler type Mising');
  }
};
