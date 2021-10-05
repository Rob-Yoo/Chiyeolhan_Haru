import PushNotification from 'react-native-push-notification';

export const arriveOnTimeNotification = () => {
  PushNotification.localNotificationSchedule({
    //... You can use all the options from localNotifications
    id: 'ON_TIME',
    message: '일정 장소 부근에 도착하셨네요. 당신의 치열한 하루를 응원합니다.', // (required)
    date: new Date(Date.now() + 1000 * 60),
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
  });
  PushNotification.removeDeliveredNotifications(['ON_TIME']);
};

export const arriveLateNotification = () => {
  PushNotification.localNotificationSchedule({
    //... You can use all the options from localNotifications
    id: 'LATE',
    message:
      '일정 장소 부근에 늦게 도착하셨네요. 당신의 치열한 하루를 응원합니다.', // (required)
    date: new Date(Date.now() + 1000 * 60),
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
  });
  PushNotification.removeDeliveredNotifications(['LATE']);
};

export const arriveEarlyNotification = (time, schedule) => {
  PushNotification.localNotificationSchedule({
    //... You can use all the options from localNotifications
    id: `${schedule.id}E`,
    message: '일정 장소 부근에 도착하셨네요. 당신의 치열한 하루를 응원합니다.', // (required)
    date: new Date(Date.now() + 1000 * (time * 60)), // 시작 시간에 알림
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
  });
  PushNotification.removeDeliveredNotifications([`${schedule.id}E`]);
};

export const completeNotification = (time, schedule) => {
  PushNotification.localNotificationSchedule({
    //... You can use all the options from localNotifications
    id: `${schedule.id}C`,
    message: '수고하셨습니다', // (required)
    date: new Date(Date.now() + 1000 * (time * 60)),
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
  });
  PushNotification.removeDeliveredNotifications([`${schedule.id}C`]);
};

export const failNotification = (time, id) => {
  PushNotification.localNotificationSchedule({
    //... You can use all the options from localNotifications
    id: `${id}F`,
    message: '일정 장소에 오지 않았습니다. 다시 시작 버튼을 눌러주세요.', // (required)
    date: new Date(Date.now() + 1000 * (time * 60)), // 시작 시간에 알림
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
  });
  PushNotification.removeDeliveredNotifications([`${id}F`]);
};

export const cancelNotification = (id) => {
  PushNotification.cancelLocalNotification(`${id}E`); //arriveEarlyNotification 알림 사라짐
  PushNotification.cancelLocalNotification(`${id}C`); //완료 알림 사라짐
  PushNotification.cancelLocalNotification(`${id}F`); //Fail 알림 사라짐
};

export const notifHandler = (arriveType, schedule, timeDiff = 0) => {
  switch (arriveType) {
    case 'ON_TIME':
      arriveOnTimeNotification();
      PushNotification.cancelLocalNotification(`${schedule.id}F`);
      break;
    case 'LATE':
      arriveLateNotification();
      PushNotification.cancelLocalNotification(`${schedule.id}F`);
      break;
    case 'EARLY':
      arriveEarlyNotification(timeDiff, schedule);
      PushNotification.cancelLocalNotification(`${schedule.id}F`);
      break;
    default:
      console.log('Notif Flag Missing');
  }
};
