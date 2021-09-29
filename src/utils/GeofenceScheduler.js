import AsyncStorage from '@react-native-community/async-storage';

import { cancelNotification } from 'utils/Notification';
import { geofenceUpdate } from 'utils/BgGeofence';
import { getCurrentTime } from 'utils/Time';

import {
  KEY_VALUE_GEOFENCE,
  KEY_VALUE_NEAR_BY,
  KEY_VALUE_EARLY,
  KEY_VALUE_PROGRESSING,
  KEY_VALUE_SUCCESS,
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

export const checkGeofenceSchedule = async () => {
  // 가장 최신의 지오펜스 일정 끝시간이 지났을 때 해당 일정이 성공한 일정 배열에 존재하는지 체크
  // 없으면 다음 일정으로 업데이트 해줘야한다.
  try {
    const geofenceData = await getDataFromAsync(KEY_VALUE_GEOFENCE);
    const successSchedules = await getDataFromAsync(KEY_VALUE_SUCCESS);
    const currentTime = getCurrentTime();
    let isNeedUpdate = false;

    if (geofenceData) {
      if (geofenceData.length > 0) {
        if (geofenceData[0].finishTime <= currentTime) {
          if (successSchedules) {
            // successSchedules이 빈 배열 경우에는 무조건 true 반환
            isNeedUpdate = successSchedules.every(
              (schedule) => geofenceData[0].id !== schedule.id,
            );
          } else {
            // successSchedules이 null인 경우는 앱을 처음 설치하고 첫 일정 장소에 들어오지 않는 경우이다.
            isNeedUpdate = true;
          }
        }
      }
    }
    console.log(
      '안와서 다음 일정으로 업데이트가 수동으로 필요한가요? : ',
      isNeedUpdate,
    );
    return isNeedUpdate;
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

    if (nearBySchedules) {
      // 일정이 현재 진행 중이라면 새로운 일정을 추가를 하면 현재 진행 중인 일정이 GEOFENCE 배열에서 사라진다.
      if (isChangeEarliest) {
        //추가 되기전 가장 최신 일정의 각 예약된 알림들을 모두 취소한다.
        cancelNotification(geofenceData[1].id);
      } else if (progressing == null) {
        // 현재 일정이 진행 중이 아니고 EARLY로 들어온 것만 인식된 상황이라면 각 예약된 알림들을 모두 취소한다.
        cancelNotification(geofenceData[0].id);
      }

      for (const schedule of nearBySchedules) {
        //nearBy 일정들의 각 예약된 알림들을 모두 취소한다.
        cancelNotification(schedule.id);
      }
      await geofenceUpdate(geofenceData, 0);
      console.log('nearBySchedules인 경우');
    } else {
      if (isEarly) {
        if (isChangeEarliest) {
          cancelNotification(geofenceData[1].id);
        } else {
          cancelNotification(geofenceData[0].id);
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
            console.log('geofenceData : ', geofenceData);
            await geofenceUpdate(geofenceData, 0);
            console.log('nearBySchedule X isEarly X Progressing인 경우');
          }
        } else if (isChangeEarliest) {
          // 현재 진행중인 일정에 neartBySchedules가 없고 도착 상태도 아니고 제일 빠른 시간의 일정이 바뀌었다면
          await geofenceUpdate(geofenceData, 0);
          console.log('nearBySchedule X isEarly X isChangeEarliest인 경우');
        }
      }
    }
  } catch (e) {
    console.log('geofenceScheduler Error :', e);
  }
};
