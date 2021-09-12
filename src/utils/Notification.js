import PushNotification from 'react-native-push-notification';
// import { commonTimeExpression } from 'utils/Time';

export const arriveOnTimeNotification = () => {
  PushNotification.localNotificationSchedule({
    //... You can use all the options from localNotifications
    id: '1',
    message: '일정 장소 부근에 도착하셨네요. 당신의 치열한 하루를 응원합니다.', // (required)
    date: new Date(Date.now() + 1000 * 60),
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
  });
  PushNotification.removeDeliveredNotifications(['1']);
};

export const arriveLateNotification = () => {
  PushNotification.localNotificationSchedule({
    //... You can use all the options from localNotifications
    id: '2',
    message:
      '일정 장소 부근에 늦게 도착하셨네요. 당신의 치열한 하루를 응원합니다.', // (required)
    date: new Date(Date.now() + 1000 * 60),
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
  });
  PushNotification.removeDeliveredNotifications(['2']);
};

export const arriveEarlyNotification = (time, schedule) => {
  PushNotification.localNotificationSchedule({
    //... You can use all the options from localNotifications
    id: `${schedule.id} + 3`,
    message: '일정 장소 부근에 도착하셨네요. 당신의 치열한 하루를 응원합니다.', // (required)
    date: new Date(Date.now() + 1000 * (time * 60)), // 시작 시간에 알림
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
  });
  PushNotification.removeDeliveredNotifications([`${schedule.id} + 3`]);
};

export const completeNotification = (isNextSchedule, time, schedule) => {
  let msg;
  if (isNextSchedule) {
    msg = `수고하셨습니다. 다음 일정 화이팅!`;
  } else {
    msg = '수고하셨습니다.';
  }

  PushNotification.localNotificationSchedule({
    //... You can use all the options from localNotifications
    id: `${schedule.id} + 4`,
    message: `${msg}`, // (required)
    date: new Date(Date.now() + 1000 * (time * 60)),
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
  });
  PushNotification.removeDeliveredNotifications([`${schedule.id} + 4`]);
};

export const notifHandler = (arriveType, timeDiff = 0, schedule = null) => {
  switch (arriveType) {
    case 'ON_TIME':
      arriveOnTimeNotification();
      break;
    case 'LATE':
      arriveLateNotification();
      break;
    case 'EARLY':
      arriveEarlyNotification(timeDiff, schedule);
      break;
    default:
      console.log('Notif Flag Missing');
  }
};
