import PushNotification from 'react-native-push-notification';
import { commonTimeExpression } from 'utils/Time';

export const successNotification = () => {
  PushNotification.localNotificationSchedule({
    //... You can use all the options from localNotifications
    id: '1',
    message: '일정 장소 부근에 도착하셨네요. 당신의 치열한 하루를 응원합니다.', // (required)
    date: new Date(Date.now() + 1000 * 60), // 60초로 나중에 바꾸자
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
    date: new Date(Date.now() + 1000 * 60), // 60초로 나중에 바꾸자
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
  });
  PushNotification.removeDeliveredNotifications(['2']);
};

export const arriveEarlyNotification = () => {
  PushNotification.localNotificationSchedule({
    //... You can use all the options from localNotifications
    id: '3',
    message:
      '일정 장소 부근에 일찍 도착하셨네요. 부지런한 당신의 치열한 하루를 응원합니다.', // (required)
    date: new Date(Date.now() + 1000 * 60), // in 60 secs
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
  });
  PushNotification.removeDeliveredNotifications(['3']);
};

export const arriveTooEarlyNotification = (time) => {
  PushNotification.localNotificationSchedule({
    //... You can use all the options from localNotifications
    id: '4',
    message:
      '일정 장소 부근에 일찍 도착하셨네요. 부지런한 당신의 치열한 하루를 응원합니다.', // (required)
    date: new Date(Date.now() + 1000 * (time * 60 - 600)), // 시작시간에 10분
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
  });
  PushNotification.removeDeliveredNotifications(['4']);
};

export const notifyNextSchedule = (startTime, location) => {
  const timeNotify = commonTimeExpression(startTime); // ex) 09:05 -> 오전 9시 5분
  const msg = `수고하셨습니다. ${timeNotify}에 ${location}에서 다음 일정이 예정되어 있습니다.`;

  PushNotification.localNotificationSchedule({
    //... You can use all the options from localNotifications
    id: '5',
    message: `${msg}`, // (required)
    date: new Date(Date.now() + 1000), // 시작시간에 10분
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
  });
  PushNotification.removeDeliveredNotifications(['5']);
};
