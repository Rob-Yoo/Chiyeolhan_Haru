import PushNotification from 'react-native-push-notification';

export const arriveOnTimeNotification = () => {
  PushNotification.localNotificationSchedule({
    //... You can use all the options from localNotifications
    id: 'ON_TIME',
    title: '치열한 하루🔥',
    message: `나 어쩌면,,,${schedule.location}에 도착했을지도,,,?👀`, // (required)
    date: new Date(Date.now() + 1000 * 60),
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
  });
  PushNotification.removeDeliveredNotifications(['ON_TIME']);
};

export const arriveLateNotification = () => {
  PushNotification.localNotificationSchedule({
    //... You can use all the options from localNotifications
    id: 'LATE',
    title: '치열한 하루🏃‍♂️',
    message: `목표 장소에 조금 늦었네요.`, // (required)
    date: new Date(Date.now() + 1000 * 60),
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
  });
  PushNotification.removeDeliveredNotifications(['LATE']);
};

export const arriveEarlyNotification = (time, schedule) => {
  PushNotification.localNotificationSchedule({
    //... You can use all the options from localNotifications
    id: `${schedule.id}E`,
    title: '치열한 하루🔥',
    message: `나 어쩌면,,,${schedule.location}에 도착했을지도,,,?👀`, // (required)
    date: new Date(Date.now() + 1000 * (time * 60)), // 시작 시간에 알림
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
  });
  PushNotification.removeDeliveredNotifications([`${schedule.id}E`]);
};

export const failNotification = (time, id) => {
  PushNotification.localNotificationSchedule({
    //... You can use all the options from localNotifications
    id: `${id}F`,
    title: '치열한 하루🚨',
    message: `지금 들어와서 SKIP 버튼을 눌러주세요!`, // (required)
    date: new Date(Date.now() + 1000 * (time * 60)), // 시작 시간에 알림
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
  });
  PushNotification.removeDeliveredNotifications([`${id}F`]);
};

export const cancelNotification = (id) => {
  PushNotification.cancelLocalNotification(`${id}E`); //arriveEarlyNotification 알림 사라짐
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
