import { Alert } from 'react-native';
import { toDosDeleteDB } from 'utils/Database';
import { geofenceUpdate } from 'utils/BgGeofence';

export const alertStartTimePicker = (hideTimePicker) =>
  Alert.alert(
    `현재 시간보다 이전 시간대는\n선택할 수 없습니다.`,
    '',
    [
      {
        text: '취소',
        onPress: () => hideTimePicker(),
        style: 'default',
      },
      { text: '확인' },
    ],
    { cancelable: false },
  );

export const alertStartTimeError = () =>
  Alert.alert(
    `현재 시간보다 이전 시간대의\n 일정은 생성할 수 없습니다.`,
    '',
    [
      {
        text: '취소',
        style: 'cancel',
      },
      { text: '확인' },
    ],
    { cancelable: false },
  );

export const alertFinsihTimePicker = (message, hideTimePicker) =>
  Alert.alert(
    `${message}`,
    '',
    [
      {
        text: '취소',
        onPress: () => hideTimePicker(),
        style: 'cancel',
      },
      { text: '확인' },
    ],
    { cancelable: false },
  );

export const alertNotFillIn = (message) =>
  Alert.alert(
    `${message}`,
    '',
    [
      {
        text: '취소',
        style: 'cancel',
      },
      { text: '확인' },
    ],
    { cancelable: false },
  );

export const noDataAlert = () =>
  Alert.alert(
    '검색 결과가 없습니다.',
    '',
    [
      {
        text: '취소',
        style: 'cancel',
      },
      { text: '확인' },
    ],
    { cancelable: false },
  );

export const alertInValidSubmit = () =>
  Alert.alert(
    '그 시간대에 이미 다른 일정이 존재합니다.',
    '',
    [
      {
        text: '취소',
        style: 'cancel',
      },
      { text: '확인' },
    ],
    { cancelable: false },
  );

export const denyDeleteToDoAlert = (denyType) => {
  switch (denyType) {
    case 'CURRENT':
      Alert.alert(
        '현재 진행 중인 일정은 삭제할 수 없습니다.',
        '',
        [
          {
            text: '취소',
            style: 'cancel',
          },
          { text: '확인' },
        ],
        { cancelable: false },
      );
      break;
    case 'PREVIOUS':
      Alert.alert(
        '지난 일정은 삭제할 수 없습니다.',
        '',
        [
          {
            text: '취소',
            style: 'cancel',
          },
          { text: '확인' },
        ],
        { cancelable: false },
      );
      break;
    case 'ARRIVE_EARLY':
      Alert.alert(
        `현재 일정 장소 부근에 있습니다.\n일정을 진행 중인 것으로 판단하여\n현재 일정을 삭제할 수 없습니다.`,
        ``,
        [
          {
            text: '취소',
            style: 'cancel',
          },
          { text: '확인' },
        ],
        { cancelable: false },
      );
      break;
    default:
      console.log('denyType Missing');
  }
};

export const denyEditToDoAlert = (denyType) => {
  switch (denyType) {
    case 'CURRENT':
      Alert.alert(
        '현재 진행 중인 일정은 수정할 수 없습니다.',
        '',
        [
          {
            text: '취소',
            style: 'cancel',
          },
          { text: '확인' },
        ],
        { cancelable: false },
      );
      break;
    case 'PREVIOUS':
      Alert.alert(
        '지난 일정은 수정할 수 없습니다.',
        '',
        [
          {
            text: '취소',
            style: 'cancel',
          },
          { text: '확인' },
        ],
        { cancelable: false },
      );
      break;
    case 'ARRIVE_EARLY':
      Alert.alert(
        `현재 일정 장소 부근에 있습니다.\n일정을 진행 중인 것으로 판단하여\n현재 일정을 수정할 수 없습니다.`,
        ``,
        [
          {
            text: '취소',
            style: 'cancel',
          },
          { text: '확인' },
        ],
        { cancelable: false },
      );
      break;
    default:
      console.log('denyType Missing');
  }
};

export const deleteToDoAlert = async (event) =>
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
              await toDosDeleteDB(event.id);
            } catch (e) {
              console.log('deleteToDoAlert Error :', e);
            }
          },
        },
      ],
      { cancelable: false },
    );
  });
