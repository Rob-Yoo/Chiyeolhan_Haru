import AsyncStorage from '@react-native-community/async-storage';
import {
  UID,
  KEY_VALUE_GEOFENCE,
  KEY_VALUE_NEAR_BY,
  KEY_VALUE_EARLY,
  KEY_VALUE_PROGRESSING,
  TODAY,
} from 'constant/const';
import { cancelNotification } from 'utils/Notification';
import { dbService } from 'utils/firebase';
import { geofenceUpdate } from 'utils/BgGeofence';
import { getCurrentTime } from 'utils/Time';

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

export const checkGeofenceSchedule = async (id) => {
  try {
    let isNeedUpdate = false;
    const currentTime = getCurrentTime();
    const todosRef = dbService.collection(`${UID}`);
    const data = await todosRef.where('id', '==', `${id}`).get();
    data.forEach((schedule) => {
      // isDone이 false인 일정들 중 끝 시간이 지난 일정이 있으면 사용자가 직접 포그라운드에서 업데이트를 시켜줘야함
      if (schedule.data().finishTime < currentTime) {
        isNeedUpdate = true;
        return;
      }
    });
    console.log(
      '사용자가 안들어와서 직접 들어와서 업데이트 시켜줘야하나요? ',
      isNeedUpdate,
    );
    return isNeedUpdate;
  } catch (e) {
    console.log('checkGeofenceSchedule Error :', e);
  }
};

export const geofenceScheduler = async (isChangeEarliest) => {
  try {
    const toDoRef = dbService.collection(`${UID}`);
    const isEarly = await getDataFromAsync(KEY_VALUE_EARLY);
    const nearBySchedules = await getDataFromAsync(KEY_VALUE_NEAR_BY);
    const geofenceData = await getDataFromAsync(KEY_VALUE_GEOFENCE);
    const progressing = await getDataFromAsync(KEY_VALUE_PROGRESSING);

    if (nearBySchedules) {
      // 일정이 현재 진행 중이라면 새로운 일정을 추가를 하면 현재 진행 중인 일정이 GEOFENCE 배열에서 사라진다.
      if (progressing == null) {
        // 현재 일정이 진행 중이 아니고 EARLY로 들어온 것만 인식된 상황이라면 각 예약된 알림들을 모두 취소한다.
        cancelNotification(geofenceData[0].id);
      }

      if (isChangeEarliest) {
        //추가 되기전 가장 최신 일정의 각 예약된 알림들을 모두 취소한다.
        cancelNotification(geofenceData[1].id);
      }

      for (const schedule of nearBySchedules) {
        //nearBy 일정들의 각 예약된 알림들을 모두 취소한다.
        cancelNotification(schedule.id);
      }
      console.log('nearBySchedules인 경우');
    } else {
      if (isEarly) {
        cancelNotification(geofenceData[0].id);
        if (isChangeEarliest) {
          cancelNotification(geofenceData[1].id);
        }
        console.log('nearBySchedule X isEarly인 경우');
        // 현재 일정 이후의 일정이라도 추가한 일정이 nearBy일 수 있기 때문에 다시 지오펜스를 킨다.
      } else {
        if (progressing) {
          console.log(progressing);
          // 현재 일정 시작 시간이 지났는데 아직 안들어와서 새로운 일정을 추가한 경우
          console.log('nearBySchedule X isEarly X Progressing인 경우');
          const progressingData = await toDoRef.doc(`${progressing.id}`).get();
          const progressingIsDone = progressingData.data().isDone;
          if (progressingIsDone == false) {
            geofenceData.unshift(progressing);
            await AsyncStorage.setItem(
              KEY_VALUE_GEOFENCE,
              JSON.stringify(geofenceData),
            );
          }
        } else if (isChangeEarliest) {
          // 현재 진행중인 일정에 neartBySchedules가 없고 도착 상태도 아니고 제일 빠른 시간의 일정이 바뀌었다면
          console.log('nearBySchedule X isEarly X isChangeEarliest인 경우');
        }
      }
    }
    await geofenceUpdate(geofenceData, 0);
  } catch (e) {
    console.log('geofenceScheduler Error :', e);
  }
};
