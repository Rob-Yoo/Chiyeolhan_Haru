const geofenceUpdateTrigger = async (
  data,
  currentTime,
  arriveType,
  timeDiff = 0,
) => {
  const currentLocation = { lat: data[0].latitude, lon: data[0].longitude };
  try {
    const result = await AsyncStorage.getItem(KEY_VALUE_PREV_DATA);
    if (result == null) {
      // 맨 처음 일정
      if (data.length >= 2) {
        // 뒤에 일정이 있을 경우
        const nextLat = data[1].latitude;
        const nextLon = data[1].longitude;
        const nextLocation = { lat: nextLat, lon: nextLon };
        const distance = getDistance(currentLocation, nextLocation);
        if (0 <= distance && distance <= 200) {
          // 다음 일정이 현재 지오펜스 반경 안의 위치일 때
          // const timeDiff = getEarlyTimeDiff(data[0].startTime, currentTime);
          // arriveTooEarlyNotification(timeDiff);
          // geofenceUpdate(data);
        } else {
          // 아니라면 그냥 현재 일정의 알람을 수행하고 바로 지오펜스 업데이트가 된다. TOO_EARLY 일떄는 제외
          notifHandler(arriveType, timeDiff);
          if (arriveType != 'TOO_EARLY') {
            geofenceUpdate(data);
          }
        }
      } else {
        // 뒤에 일정이 없을 경우
        notifHandler(arriveType, timeDiff);
        if (arriveType != 'TOO_EARLY') {
          geofenceUpdate(data);
        }
      }
    } else {
      // 맨 처음이 아닌 일정들
      // 지오펜스 업데이트는 ENTER되면 바로 이루어지는데 이때 지금 일정 장소와 다음 일정 장소의 거리가 200m 이내라면 지금 일정이 끝나지도 않았는데 다음 일정이 완료되는 동작이 발생한다.
      // 따라서 현재 일정 장소가 이전 일정 장소에서 200m 내로 거리차가 난다면 이전 일정이 아직 끝나지 않은 상황이기 때문에 도착알림을 현재 일정 시작시간으로 미루어놓고 지오펜스 업데이트를 통해
      // isDone은 true를 만들어놓지만 시간표와 홈에서는 색칠되는 조건을 isDone == true 뿐만 아니라 현재 시간이 현재 일정 시작시간보다 더 이후여야 한다는 것을 추가했기 때문에
      // 현재 시간이 현재 일정 시작시간 이전일 떄는 시간표에서 색칠되지 않는다. 따라서 내부적으로는 완료된 것이지만 사용자 입장에서는 아직 완료되지 않은 것처럼 보인다.
      const prevData = JSON.parse(result);
      const prevLocation = { lat: prevData.latitude, lon: prevData.longitude };
      const distance = getDistance(currentLocation, prevLocation);
      if (0 <= distance && distance <= 200) {
        geofenceUpdate(data);
        //
        // const timeDiff = getEarlyTimeDiff(data[0].startTime, currentTime);
        // arriveTooEarlyNotification(timeDiff);
        // geofenceUpdate(data);
      } else {
        notifHandler(arriveType, timeDiff);
        if (arriveType != 'TOO_EARLY') {
          geofenceUpdate(data);
        }
      }
    }
  } catch (e) {
    console.log('geofenceUpdateTrigger Error :', e);
  }
};

const geofenceUpdateTrigger = async (data, arriveType, timeDiff = 0) => {
  if (arriveType != 'TOO_EARLY') {
    notifHandler(arriveType);
    geofenceUpdate(data);
  } else {
    if (data.length >= 2) {
      const currentScheduleLocation = {
        lat: data[0].latitude,
        lon: data[0].longitude,
      };
      const nextScheduleLocation = {
        lat: data[1].latitude,
        lon: data[1].longitude,
      };
      const distance = getDistance(
        currentScheduleLocation,
        nextScheduleLocation,
      );
      console.log(distance);
      if (0 <= distance && distance <= 200) {
        // 다음 일정 장소와 거리가 200m 이내일때
        try {
          const pendingDataArray = [];
          const prevDataArray = await AsyncStorage.getItem(
            KEY_VALUE_PENDING_DATA,
          );
          if (prevDataArray == null) {
            pendingDataArray.push({
              id: data[0].id,
              startTime: data[0].startTime,
              willDone: true,
            });
            await AsyncStorage.setItem(
              KEY_VALUE_PENDING_DATA,
              JSON.stringify(pendingDataArray),
            );
          } else {
            const parseDataArray = JSON.parse(prevDataArray);
            parseDataArray.forEach((prevData) => {
              pendingDataArray.push(prevData);
            });
            pendingDataArray.push({
              id: data[0].id,
              startTime: data[0].startTime,
              willDone: true,
            });
            await AsyncStorage.setItem(
              KEY_VALUE_PENDING_DATA,
              JSON.stringify(pendingDataArray),
            );
          }
          notifHandler('PENDING', timeDiff); // PENDING 알림 예약
          geofenceUpdate(data); // isDone을 true로 안 바꿈
        } catch (e) {
          console.log('geofenceUpdateTrigger Error :', e);
        }
      } else {
        // 다음 일정 장소와의 거리가 200m 초과일때
        notifHandler(arriveType, timeDiff); // TOO_EARLY 알림 예약
        // geofenceUpdate는 EXIT일 때
      }
    } else {
      // 남은 일정이 현재 이거 하나일때 혹은 애초에 일정이 하나밖에 없었을 때
      notifHandler(arriveType, timeDiff); // TOO_EARLY 알림 예약
      // geofenceUpdate는 EXIT일 때
    }
  }
};
