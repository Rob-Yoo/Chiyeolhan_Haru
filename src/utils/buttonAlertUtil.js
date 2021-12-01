import { Alert, Keyboard, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  submitAllFailNotif,
  removeAllStartNotif,
} from 'utils/notificationUtil';
import { getCurrentTime } from 'utils/timeUtil';

import {
  KEY_VALUE_DAY_CHANGE,
  KEY_VALUE_START_TODO,
  KEY_VALUE_GEOFENCE,
} from 'constant/const';

export const alertStartTimePicker = () => {
  Keyboard.dismiss();
  Alert.alert(
    `현재 시간보다 이전 시간대는\n선택할 수 없습니다.`,
    '',
    [{ text: '확인' }],
    { cancelable: false },
  );
};
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
export const requestDeniedAlert = () =>
  Alert.alert(
    '검색 요청 권한이 없습니다.',
    '반복 시 관리자에게 알려주세요',
    [{ text: '확인' }],
    {
      cancelable: false,
    },
  );
export const invalidRequestAlert = () =>
  Alert.alert(
    '유효하지 않은 요청입니다.',
    '반복 시 관리자에게 알려주세요',
    [{ text: '확인' }],
    {
      cancelable: false,
    },
  );
export const limitRequestAlert = () =>
  Alert.alert(
    '검색 요청 횟수를 초과 하였습니다.',
    '반복 시 관리자에게 알려주세요',
    [{ text: '확인' }],
    {
      cancelable: false,
    },
  );

export const errorNotifAlert = (e) => {
  Alert.alert(
    'Error',
    `${e}\n에러 반복 시 관리자에게 알려주세요`,
    [{ text: '확인' }],
    {
      cancelable: false,
    },
  );
};

export const skipNotifAlert = (title = null) => {
  let msg1;
  let msg2 = '';
  if (title == null) {
    msg1 = `다음 일정이 없습니다`;
    msg2 = '새로운 일정 추가시 위치 서비스가 다시 제공됩니다.';
  } else {
    msg1 = `"${title}"`;
    msg2 = '해당 일정에 위치 서비스를 제공하겠습니다.';
  }
  Alert.alert(`${msg1}`, `${msg2}`, [{ text: '확인' }], {
    cancelable: false,
  });
};

export const skipDenyAlert = () =>
  Alert.alert('스킵 버튼', '스킵 가능한 일정이 없습니다', [{ text: '확인' }], {
    cancelable: false,
  });

export const startBtnAlert = () =>
  Alert.alert('시작 버튼을 눌러주세요!', '', [{ text: '확인' }], {
    cancelable: false,
  });

export const skipBtnAlert = () =>
  Alert.alert('스킵 버튼을 눌러주세요!', '', [{ text: '확인' }], {
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
      `시작 버튼`,
      '시간이 지난 일정들만 있습니다.\n새로운 일정을 추가하고 시작 버튼 누르는 거 잊지 말아주세요!',
      [{ text: '확인' }],
      { cancelable: false },
    );
  }
};

export const geofenceAlert = (title) => {
  Alert.alert(
    `"${title}"`,
    '해당 일정에 위치 서비스를 제공합니다.',
    [{ text: '확인' }],
    { cancelable: false },
  );
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

            if (geofenceData.length == 0) {
              strtAlert();
            } else {
              await geofenceUpdate(geofenceData, 0);
              await AsyncStorage.setItem(KEY_VALUE_START_TODO, 'true');
              await AsyncStorage.setItem(KEY_VALUE_DAY_CHANGE, 'false');
              strtAlert(geofenceData[0].title);
            }
          } catch (e) {
            errorNotifAlert(`startAlert Error :  ${e}`);
          }
        },
      },
    ],
    {
      cancelable: false,
    },
  );

export const permissionDenyAlert = () =>
  Alert.alert(
    `위치 서비스 이용 제한`,
    `원활한 서비스 제공을 위해 위치 서비스 이용에 대한 액세스 권한을 '항상'으로 설정해주세요.`,
    [
      {
        text: '설정',
        onPress: () => {
          Linking.openSettings();
        },
      },
      {
        text: '취소',
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
      `시작 버튼`,
      `오늘 하루가 아직 끝나지 않았어요!`,
      [{ text: '확인' }],
      {
        cancelable: false,
      },
    );
  }
};

export const addModifyBlockAlert = () =>
  Alert.alert('스킵 버튼을 먼저 눌러주세요.', '', [{ text: '확인' }], {
    cancelable: false,
  });

export const favoriteAlert = (location) =>
  Alert.alert(
    `'${location}'`,
    '즐겨찾기에 추가되었습니다.',
    [{ text: '확인' }],
    {
      cancelable: false,
    },
  );

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
      `삭제하시겠습니까?`,
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
              errorNotifAlert(`deleteToDoAlert Error : ${e}`);
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
      `체크 리스트를 삭제 하시겠습니까?`,
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
              errorNotifAlert(`deleteToDoTask Error : ${e}`);
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

export const weakNetworkAlert = () =>
  Alert.alert('인터넷 연결 상태가 좋지 않습니다.', '', [{ text: '확인' }], {
    cancelable: false,
  });

export const longTaskList = () =>
  Alert.alert(
    `일정의 체크 리스트를 너무 길게 설정했습니다.\n(다음 체크리스트를 이용하세요.)`,
    '',
    [{ text: '확인' }],
    {
      cancelable: false,
    },
  );

//지난일정 체크리스트 일때 알림 보내기
export const passedTodoAlert = () =>
  Alert.alert(`이미 지난 일정입니다.`, '', [{ text: '확인' }], {
    canvelable: false,
  });
