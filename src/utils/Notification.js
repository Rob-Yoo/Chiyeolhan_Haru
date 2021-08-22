import PushNotification from 'react-native-push-notification';

export const successNotification = () => {
  PushNotification.localNotificationSchedule({
    //... You can use all the options from localNotifications
    id: '1',
    message: '해당 장소에 도착하셨습니다. 당신의 치열한 하루를 응원합니다.', // (required)
    date: new Date(Date.now() + 1000), // in 60 secs
    allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
  });
  PushNotification.removeDeliveredNotifications(['1']);
};
