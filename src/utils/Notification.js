import PushNotification from 'react-native-push-notification';

export const successNotification = () => {
  PushNotification.localNotificationSchedule({
    //... You can use all the options from localNotifications
    id: '1',
    message: '일정 장소 부근에 도착하셨네요. 당신의 치열한 하루를 응원합니다.', // (required)
    date: new Date(Date.now() + 1000), // 120초로 나중에 바꾸자
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
  });
  PushNotification.removeDeliveredNotifications(['1']);
};

export const arriveEarlyNotification = () => {
  PushNotification.localNotificationSchedule({
    //... You can use all the options from localNotifications
    id: '2',
    message:
      '일정 장소 부근에 일찍 도착하셨네요. 부지런한 당신의 치열한 하루를 응원합니다.', // (required)
    date: new Date(Date.now() + 1000), // in 60 secs
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
  });
  PushNotification.removeDeliveredNotifications(['2']);
};

export const arriveTooEarlyNotification = (time) => {
  PushNotification.localNotificationSchedule({
    //... You can use all the options from localNotifications
    id: '3',
    message:
      '일정 장소 부근에 일찍 도착하셨네요. 부지런한 당신의 치열한 하루를 응원합니다.', // (required)
    date: new Date(Date.now() + 1000 * (time * 60 - 600)), // in 60 secs
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
  });
  PushNotification.removeDeliveredNotifications(['3']);
};
