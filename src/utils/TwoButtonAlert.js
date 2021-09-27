import { Alert } from 'react-native';

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
  Alert.alert(
    '일정의 제목을 너무 길게 설정 했습니다.',
    '',
    [{ text: '확인' }],
    {
      cancelable: false,
    },
  );

export const longTaskList = () =>
  Alert.alert(
    '일정의 수행리스트를 너무 길게 설정 했습니다.(다음 수행리스트를 이용 하세요)',
    '',
    [{ text: '확인' }],
    {
      cancelable: false,
    },
  );
