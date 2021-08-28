import { Alert } from 'react-native';

export const alertStartTimePicker = (hideTimePicker) =>
  Alert.alert(
    '이전 시간대는 선택할 수 없습니다.',
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
