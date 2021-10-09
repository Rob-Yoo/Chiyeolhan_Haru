import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { submitAllFailNotif, removeAllStartNotif } from 'utils/Notification';
import { getCurrentTime } from 'utils/Time';

import {
  KEY_VALUE_DAY_CHANGE,
  KEY_VALUE_START_TODO,
  KEY_VALUE_GEOFENCE,
} from 'constant/const';

export const alertStartTimePicker = () =>
  Alert.alert(
    `현재 시간보다 이전 시간대는\n선택할 수 없습니다.`,
    '',
    [{ text: '확인' }],
    { cancelable: false },
  );

export const alertFinsihTimePicker = (message) =>
  Alert.alert(`${message}`, '', [{ text: '확인' }], { cancelable: false });

export const alertStartTimeError = () =>
  Alert.alert(
    `현재 시간보다 이전 시간대의\n 일정은 생성할 수 없습니다.`,
    '',
    [{ text: '확인' }],
    { cancelable: false },
  );

export const offlineAlert = () =>
  Alert.alert(
    `인터넷 연결이 끊겼습니다.\n일부 서비스가 제한될 수 있습니다.`,
    '',
    [{ text: '확인' }],
    { cancelable: false },
  );

export const alertNotFillIn = (message) =>
  Alert.alert(`${message}`, '', [{ text: '확인' }], { cancelable: false });

export const noDataAlert = () =>
  Alert.alert('검색 결과가 없습니다.', '', [{ text: '확인' }], {
    cancelable: false,
  });

export const skipNotifAlert = (title = null) => {
  let msg1;
  let msg2 = '';
  if (title == null) {
    msg1 = `다음 일정이 없으므로\n위치 서비스를 종료합니다.`;
  } else {
    msg1 = `"${title}"`;
    msg2 = '해당 일정에 위치 서비스를 제공하겠습니다.';
  }
  Alert.alert(`${msg1}`, `${msg2}`, [{ text: '확인' }], {
    cancelable: false,
  });
};

export const skipDenyAlert = () =>
  Alert.alert(
    'SKIP',
    '목표 장소에 가지 않을 경우 눌러주세요.',
    [{ text: '확인' }],
    {
      cancelable: false,
    },
  );

export const startBtnAlert = () =>
  Alert.alert('시작 버튼을 눌러주세요!', '', [{ text: '확인' }], {
    cancelable: false,
  });

const strtAlert = (title = null) => {
  if (title !== null) {
    Alert.alert(
      `"${title}"`,
      '해당 일정부터 시작됩니다\n치열한 하루를 응원할께요!',
      [{ text: '확인' }],
      { cancelable: false },
    );
  } else {
    Alert.alert(
      `일정이 없습니다\n일정을 더 추가해보세요!`,
      '',
      [{ text: '확인' }],
      { cancelable: false },
    );
  }
};

export const startAlert = (geofenceUpdate, data) =>
  Alert.alert(
    `치열한 하루를 시작해볼까요?`,
    '',
    [
      {
        text: '취소',
      },
      {
        text: '확인',
        onPress: async () => {
          try {
            const currentTime = getCurrentTime();
            // 시작 버튼 누르기 전 지나간 일정들 지오펜스 배열에서 제외
            const geofenceData = data.filter((schedule) => {
              return schedule.finishTime > currentTime;
            });

            submitAllFailNotif(geofenceData); // 모든 일정의 fail알림 등록
            removeAllStartNotif(geofenceData); // startNotif 알림 삭제

            await AsyncStorage.setItem(
              KEY_VALUE_GEOFENCE,
              JSON.stringify(geofenceData),
            );
            await geofenceUpdate(geofenceData, 0);
            await AsyncStorage.setItem(KEY_VALUE_START_TODO, 'true');
            await AsyncStorage.setItem(KEY_VALUE_DAY_CHANGE, 'false');

            if (geofenceData.length == 0) {
              strtAlert();
            } else {
              strtAlert(geofenceData[0].title);
            }
          } catch (e) {
            console.log('startAlert Error : ', e);
          }
        },
      },
    ],
    {
      cancelable: false,
    },
  );

export const startDenyAlert = (type) => {
  if (type == 1) {
    Alert.alert(
      '일정이 없습니다\n오늘 일정을 추가해보세요!',
      '',
      [{ text: '확인' }],
      {
        cancelable: false,
      },
    );
  } else if (type == 2) {
    Alert.alert(
      `시작`,
      `치열한 하루를 시작할 때 눌러주세요.\n-\n위치 서비스를 시작하면 백그라운드에서 계속 동작하기 때문에 배터리가 소모될 수 있습니다.\n따라서, 첫 일정의 시작 시간 직전에 누르는 것이 좋습니다.`,
      [{ text: '확인' }],
      {
        cancelable: false,
      },
    );
  }
};

export const addModifyBlockAlert = () =>
  Alert.alert('SKIP 버튼을 먼저 눌러주세요.', '', [{ text: '확인' }], {
    cancelable: false,
  });

export const favoriteAlert = () =>
  Alert.alert('즐겨찾기에 추가되었습니다.', '', [{ text: '확인' }], {
    cancelable: false,
  });

export const deleteFavoriteAlert = () =>
  Alert.alert('즐겨찾기에서 삭제되었습니다.', '', [{ text: '확인' }], {
    cancelable: false,
  });

export const alertInValidSubmit = () =>
  Alert.alert(
    '그 시간대에 이미 다른 일정이 존재합니다.',
    '',
    [{ text: '확인' }],
    { cancelable: false },
  );

export const deleteToDoAlert = async (id) =>
  new Promise((resolve) => {
    Alert.alert(
      `일정을 삭제 하시겠습니까?`,
      '',
      [
        {
          text: '취소',
        },
        {
          text: '확인',
          style: 'destructive',
          onPress: async () => {
            try {
              resolve('true');
            } catch (e) {
              console.log('deleteToDoAlert Error :', e);
            }
          },
        },
      ],
      { cancelable: false },
    );
  });

export const deleteToDoTaskList = async () =>
  new Promise((resolve) => {
    Alert.alert(
      `수행 리스트를 삭제 하시겠습니까?`,
      '',
      [
        {
          text: '취소',
        },
        {
          text: '확인',
          style: 'destructive',
          onPress: async () => {
            try {
              resolve('true');
            } catch (e) {
              console.log('deleteToDoTask Error :', e);
            }
          },
        },
      ],
      { cancelable: false },
    );
  });

export const longTodoTitle = () =>
  Alert.alert('일정의 제목을 너무 길게 설정했습니다.', '', [{ text: '확인' }], {
    cancelable: false,
  });

export const longTaskList = () =>
  Alert.alert(
    `일정의 수행 리스트를 너무 길게 설정했습니다.\n(다음 수행리스트를 이용하세요.)`,
    '',
    [{ text: '확인' }],
    {
      cancelable: false,
    },
  );
