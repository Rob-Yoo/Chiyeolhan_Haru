import React, { useEffect, useRef, useState } from 'react';
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  ImageBackground,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';
import { useForm } from 'react-hook-form';
import { create, editToDoDispatch, deleteToDoDispatch } from 'redux/store';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Map from 'components/screen/Map';
import styles from 'components/modal/ToDoModalStyle';
import { TimePicker } from 'components/items/TimePicker';
import { ToDoModalInput } from 'components/modal/ToDoModalInput';
import IconQuestion from '#assets/icons/icon-question';
import IconFavorite from '#assets/icons/icon-favorite';
import { handleFilterData } from 'utils/handleFilterData';
import {
  TODAY,
  TOMORROW,
  KEY_VALUE_TODAY_DATA,
  KEY_VALUE_START_TIME,
  KEY_VALUE_TOMORROW_DATA,
  KEY_VALUE_SUCCESS,
} from 'constant/const';
import {
  checkEarlistTodo,
  dbToAsyncStorage,
  dbToAsyncTomorrow,
  getDataFromAsync,
} from 'utils/AsyncStorage';
import { failNotification } from 'utils/Notification';
import {
  alertInValidSubmit,
  alertStartTimeError,
  alertNotFillIn,
} from 'utils/TwoButtonAlert';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'components/screen/Home';
import { getCurrentTime, getTimeDiff } from 'utils/Time';
import { toDosUpdateDB } from 'utils/Database';
import { longTaskList, longTodoTitle } from 'utils/TwoButtonAlert';

export const ToDoModal = ({
  modalHandler,
  isModalVisible,
  navigation,
  isToday,
  passModalData,
  setPassModalData,
  navigateFavorite = null,
}) => {
  const dispatch = useDispatch();
  const network = useSelector((state) => state.network);
  const toDos = useSelector((state) => state.toDos);
  const [locationName, setLocationName] = useState('');
  const [locationData, setLocationData] = useState({});
  const [inputIsVisible, setInputIsVisible] = useState(false);
  const [searchedList, setSearchedList] = useState([]);
  const [mapIsVisible, setMapIsVisible] = useState(false);
  const [isOngoing, setIsOngoing] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [task, setTask] = useState(false);
  const [canEdit, setCanEdit] = useState(true);
  const [title, setTitle] = useState('');
  const { register, handleSubmit, setValue } = useForm();
  const titleRef = useRef();

  const handleIsOnGoing = () => {
    passModalData?.startDate < new Date() && setIsOngoing(true);
  };
  const toggleIsVisible = (isVisible, setVisible) => {
    setVisible(!isVisible);
  };
  const getLocationData = (value) => {
    setLocationData(value);
    setLocationName(value.location);
  };
  const clearData = () => {
    setLocationData({});
    setLocationName(false);
    setTaskList([]);
    setTitle('');
    setPassModalData(undefined);
    setValue('todoStartTime', undefined);
    setValue('todoFinishTime', undefined);
    setValue('todoTitle', undefined);
    setValue('todoTask', undefined);
    setValue('todoId', undefined);
    setIsOngoing(false);
    network !== 'offline' && setCanEdit(true);
  };

  const toDoSubmit = async (todoStartTime, todoFinishTime, todoTitle) => {
    if (network === 'offline') {
      modalHandler();
      return;
    }
    const { latitude, location, longitude, address } =
      passModalData === undefined || passModalData?.description
        ? locationData
        : passModalData;
    const date = new Date();
    const todoId =
      `${date.getFullYear()}` +
      `${isToday ? TODAY : TOMORROW}` +
      `${todoStartTime}`;
    const currentTime = getCurrentTime();
    // 지금 추가하려는 일정이 제일 이른 시간이 아니라면 addGeofence를 하지 않게 하기 위해
    // 지금 추가하려는 일정의 시작 시간이 제일 이른 시간대인지 아닌지 isChangeEarliest로 판단하게 한다.
    try {
      const newData = {
        id: todoId,
        title: todoTitle,
        startTime: todoStartTime,
        finishTime: todoFinishTime,
        location,
        address,
        longitude,
        latitude,
        date: isToday ? TODAY : TOMORROW,
        toDos: [...taskList],
        isDone: false,
      };
      dispatch(create(newData));
      await toDosUpdateDB(newData, todoId);

      if (isToday) {
        const isChangeEarliest = await checkEarlistTodo(todoStartTime);
        const timeDiff = await getTimeDiff(currentTime, todoFinishTime);
        dbToAsyncStorage(isChangeEarliest); //isChangeEarliest가 true이면 addGeofence 아니면 안함
        failNotification(timeDiff, todoId); // 일정이 끝시간땨에 실패 알림 예약
      } else {
        dbToAsyncTomorrow();
      }

      await handleFilterData(
        location,
        'location',
        searchedList,
        setSearchedList,
      );

      if (passModalData && passModalData.description === undefined) {
        navigateFavorite();
      }
      modalHandler();

      await AsyncStorage.removeItem(KEY_VALUE_START_TIME);
    } catch (e) {
      console.log('toDoSumbit Error :', e);
    }
  };

  const handleChange = (e) => {
    setTitle(e.nativeEvent.text);
  };

  const checkValidSubmit = (toDoArray, todoStartTime, todoFinishTime) => {
    let isNeedAlert = false;

    for (const toDo of toDoArray) {
      const startTime = toDo.startTime;
      const finishTime = toDo.finishTime;

      if (passModalData?.id !== toDo.id) {
        if (todoStartTime < startTime && startTime < todoFinishTime) {
          isNeedAlert = true;
          break;
        }
        if (todoStartTime < finishTime && finishTime < todoFinishTime) {
          isNeedAlert = true;
          break;
        }
        if (startTime <= todoStartTime && todoStartTime <= finishTime) {
          isNeedAlert = true;
          break;
        }
      }
    }

    return isNeedAlert;
  };

  const todoEdit = async (todoStartTime, todoFinishTime, todoTitle) => {
    if (network === 'offline') {
      modalHandler();
      return;
    }
    try {
      let successSchedules = await getDataFromAsync(KEY_VALUE_SUCCESS);
      const id = passModalData?.id;
      const startTime = passModalData?.startTime;
      let newID;
      let isChange = false;

      if (startTime !== todoStartTime) {
        // 시작시간이 바뀌면
        isChange = true;
        const date = new Date();
        newId =
          `${date.getFullYear()}` +
          `${isToday ? TODAY : TOMORROW}` +
          `${todoStartTime}`;
        //newID 생성
        if (successSchedules !== null) {
          let idx = 0;

          for (const schedule of successSchedules) {
            if (schedule.id === id) {
              successSchedules[idx].id = newID;
              successSchedules[idx].startTime = todoStartTime;

              break;
            }
            idx = idx + 1;
          }
          if (isChange) {
            await AsyncStorage.setItem(
              KEY_VALUE_SUCCESS,
              JSON.stringify(successSchedules),
            );
          }
        }
      }
      if (isChange) {
        const { location, longitude, latitude, address } = toDos[id];
        dispatch(deleteToDoDispatch(id));
        const newData = {
          id: newId,
          title: todoTitle,
          startTime: todoStartTime,
          finishTime: todoFinishTime,
          location,
          address,
          longitude,
          latitude,
          date: isToday ? TODAY : TOMORROW,
          toDos: [...taskList],
          isDone: false,
        };
        dispatch(create(newData));
        await toDosUpdateDB(newData, newId);
      } else if (!isChange) {
        dispatch(
          editToDoDispatch({
            todoTitle,
            todoStartTime,
            todoFinishTime,
            taskList,
            id,
          }),
        );
      }

      const isChangeEarliest = isToday
        ? await checkEarlistTodo(todoStartTime)
        : true;
      isToday ? dbToAsyncStorage(isChangeEarliest) : dbToAsyncTomorrow();
      modalHandler();
    } catch (e) {
      console.log('todoModal todoEdit Error', e);
    }
  };

  const handleAlert = async (todoStartTime, todoFinishTime, todoTitle) => {
    try {
      const toDoArray = isToday
        ? await getDataFromAsync(KEY_VALUE_TODAY_DATA)
        : await getDataFromAsync(KEY_VALUE_TOMORROW_DATA);
      let isNeedAlert = false;
      if (toDoArray != null) {
        if (toDoArray.length > 0) {
          isNeedAlert = checkValidSubmit(
            toDoArray,
            todoStartTime,
            todoFinishTime,
          );
        }
        if (isNeedAlert) {
          modalHandler();
          alertInValidSubmit();
        } else {
          //passModalData
          !passModalData?.description
            ? await toDoSubmit(todoStartTime, todoFinishTime, todoTitle)
            : await todoEdit(todoStartTime, todoFinishTime, todoTitle);
        }
      } else {
        await toDoSubmit(todoStartTime, todoFinishTime, todoTitle);
      }
    } catch (e) {
      console.log('handleAlert Error :', e);
    }
  };

  const handleTodayTodoSubmit = async (
    todoStartTime,
    todoFinishTime,
    todoTitle,
  ) => {
    if (!!passModalData && getCurrentTime() > todoStartTime) {
      alertStartTimeError();
      modalHandler();
      return;
    }
    handleAlert(todoStartTime, todoFinishTime, todoTitle);
  };

  const handleTomorrowTodoSubmit = async (
    todoStartTime,
    todoFinishTime,
    todoTitle,
  ) => {
    handleAlert(todoStartTime, todoFinishTime, todoTitle);
  };

  const handleEditSubmit = async (todoStartTime, todoFinishTime, todoTitle) => {
    if (!passModalData && getCurrentTime() > todoStartTime) {
      alertStartTimeError();
      modalHandler();
      return;
    }
    handleAlert(todoStartTime, todoFinishTime, todoTitle);
  };

  const handleTodoSubmit = async ({
    todoStartTime,
    todoFinishTime,
    todoTitle,
  }) => {
    console.log(canEdit);
    if (!canEdit) {
      modalHandler();
      return;
    }
    if (isToday && todoStartTime < getCurrentTime()) {
      modalHandler();
      alertStartTimeError();
      return;
    }
    if (Object.keys(locationData).length == 0) {
      alertNotFillIn('일정 장소를 등록해주세요.');
    } else if (todoStartTime === undefined) {
      alertNotFillIn('일정의 시작시간을 등록해주세요.');
    } else if (todoFinishTime === undefined) {
      alertNotFillIn('일정의 끝시간을 등록해주세요.');
    } else if (todoTitle === undefined) {
      alertNotFillIn('일정의 제목을 입력해주세요');
    } else {
      if (!passModalData?.description && isToday) {
        //모달에 데이터가 없을때, 즉 일정을 새로 추가할때(오늘)
        handleTodayTodoSubmit(todoStartTime, todoFinishTime, todoTitle);
      } else if (!passModalData?.description && !isToday) {
        //모달에 데이터가 없을때, 즉 일정을 새로 추가할때(내일)
        handleTomorrowTodoSubmit(todoStartTime, todoFinishTime, todoTitle);
      } else if (passModalData?.description) {
        //모달에 데이터가 있을때, 즉 일정을 수정할때
        handleEditSubmit(todoStartTime, todoFinishTime, todoTitle);
      }
    }
  };

  const taskSubmit = ({ index, task }) => {
    if (task.length > 30) {
      longTaskList();
      toggleIsVisible(inputIsVisible, setInputIsVisible);
      return;
    }
    if (task.length === 0) {
      index
        ? setTaskList([
            ...taskList.slice(0, index),
            ...taskList.slice(index + 1),
          ])
        : toggleIsVisible(inputIsVisible, setInputIsVisible);
    } else {
      if (task.length > 0 && index === false) {
        setTaskList([...taskList, task]);
      } else {
        setTaskList([
          ...taskList.slice(0, index),
          task,
          ...taskList.slice(index + 1),
        ]);
      }
    }
    toggleIsVisible(inputIsVisible, setInputIsVisible);
  };

  const timeHandler = async (text, isStart) => {
    let newTime;
    const restMin = text.slice(0, 4);
    const oneDigitMin = text.slice(4);
    if ('0' <= oneDigitMin && oneDigitMin <= '4') {
      newTime = restMin + '0';
    } else if ('5' <= oneDigitMin && oneDigitMin <= '9') {
      newTime = restMin + '5';
    } else {
      // if (isStart) {
      //   setValue('todoStartTime', text);
      //   return ;
      // } else {
      //   setValue('todoFinishTime', text);
      // }
    }
    if (isStart) {
      await AsyncStorage.setItem(KEY_VALUE_START_TIME, newTime);
      setValue('todoStartTime', newTime);
    } else {
      setValue('todoFinishTime', newTime);
    }
  };

  const editSchedule = (item, index) => {
    setTask({ item, index });
    toggleIsVisible(inputIsVisible, setInputIsVisible);
  };
  const gotoFavorite = (isToday) => {
    modalHandler();
    navigation.navigate('ModalStack', {
      screen: 'Favorite',
      params: { isToday: isToday },
    });
  };
  useEffect(() => {
    //수정시 넘겨온 데이터가 있을때
    console.log(passModalData?.startDate < new Date());
    if (
      network === 'offline' ||
      isToday === 'yesterday' ||
      passModalData?.startDate < new Date()
    ) {
      setCanEdit(false);
    }
    if (passModalData !== undefined) {
      handleIsOnGoing();
      if (passModalData.description) {
        //데이터 수정 시
        setTitle(passModalData?.description);
        setTaskList([...passModalData?.toDos]);
      }
      setLocationName(passModalData?.location);
      setLocationData(passModalData?.location);
    }
  }, [passModalData]);
  useEffect(() => {
    register('todoStartTime'),
      register('todoFinishTime'),
      register('todoTitle'),
      register('todoTask', { min: 1 }),
      register('todoId');
  }, [register]);

  return (
    <Modal
      navigation={navigation}
      isVisible={isModalVisible}
      style={styles.modalStyle}
      onModalHide={() => clearData()}
      style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, margin: 0 }}
    >
      <TouchableOpacity
        style={styles.background}
        activeOpacity={1}
        onPress={modalHandler}
      />
      <View style={styles.modalInputContainer}>
        <View style={styles.modalTopContainer}>
          <View style={styles.modalTextView}>
            {canEdit ? (
              <>
                <Text style={styles.modalTopText} onPress={modalHandler}>
                  취소
                </Text>
                <TouchableOpacity>
                  <Text
                    onPress={handleSubmit(handleTodoSubmit)}
                    style={styles.modalTopText}
                  >
                    완료
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.modalTopText}
                onPress={handleSubmit(handleTodoSubmit)}
              >
                <Text style={styles.modalTopText}>닫기</Text>
              </TouchableOpacity>
            )}
          </View>

          <ImageBackground
            style={styles.imageBackgroundMapStyle}
            source={{ uri: 'map' }}
          >
            <View
              style={[
                styles.imageBackgroundStyle,
                {
                  backgroundColor: locationName
                    ? 'transparent'
                    : 'rgba(0,0,0,0.3)',
                },
              ]}
            >
              {locationName ? (
                <></>
              ) : (
                <IconQuestion
                  name="icon-question"
                  size={Dimensions.get('window').height > 667 ? 110 : 70}
                  color={'#FFFFFF'}
                  onPress={() => toggleIsVisible(mapIsVisible, setMapIsVisible)}
                />
              )}
            </View>
          </ImageBackground>
          <Text style={styles.modalLocationText}>
            {locationName ? locationName : '물음표를 눌러주세요'}
          </Text>
        </View>
        <View style={styles.timePickerContainer}>
          <TimePicker
            isStart={true}
            timeText={'시작'}
            pickerHandler={(text) => timeHandler(text, true)}
            isToday={isToday}
            timeDate={passModalData?.startDate}
            isOngoing={isOngoing}
          />
          <Text style={{ fontSize: 25 }}>~</Text>
          <TimePicker
            isStart={false}
            timeText={'끝'}
            pickerHandler={(text) => timeHandler(text, false)}
            timeDate={passModalData?.endDate}
            isOngoing={isOngoing}
          />
          {isToday !== 'yesterday' && network !== 'offline' ? (
            <TouchableOpacity onPress={() => gotoFavorite(isToday)}>
              <IconFavorite name="icon-favorite" size={50} color={'#54BCB6'} />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.todoInputContainer}>
          {network === 'offline' ||
          (passModalData && passModalData.startDate < new Date()) ? (
            <View style={styles.modalInputTitle}>
              <Text>{title}</Text>
            </View>
          ) : (
            <TextInput
              placeholder="제목을 입력해 주세요"
              style={styles.modalInputTitle}
              value={title}
              ref={titleRef}
              onChange={(e) => handleChange(e)}
              onChangeText={
                title.length > 20
                  ? () => longTodoTitle()
                  : setValue('todoTitle', title)
              }
            />
          )}
          <TouchableOpacity
            style={styles.modalInputTask}
            onPress={() =>
              network === 'offline' ||
              (!(isToday && passModalData?.startDate < new Date()) &&
                toggleIsVisible(inputIsVisible, setInputIsVisible))
            }
          >
            <Text style={styles.modalInputText}>수행리스트</Text>
          </TouchableOpacity>

          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
            }}
            style={styles.modalTaskContainer}
          >
            {taskList.map((item, index) => (
              <TouchableWithoutFeedback
                key={index}
                onPress={() =>
                  network === 'offline' ||
                  (!(isToday && passModalData?.startDate < new Date()) &&
                    editSchedule(item, index))
                }
              >
                <Text style={styles.modalInputText}>{item}</Text>
              </TouchableWithoutFeedback>
            ))}
          </ScrollView>
          {task ? (
            <ToDoModalInput
              key={task}
              taskListVisibleHandler={() =>
                toggleIsVisible(inputIsVisible, setInputIsVisible)
              }
              taskSubmitHandler={taskSubmit}
              inputIsVisible={inputIsVisible}
              prevTask={task}
              setPrevTask={setTask}
            />
          ) : (
            <ToDoModalInput
              key={task}
              taskListVisibleHandler={() =>
                toggleIsVisible(inputIsVisible, setInputIsVisible)
              }
              taskSubmitHandler={taskSubmit}
              inputIsVisible={inputIsVisible}
              prevTask={false}
            />
          )}
        </View>
      </View>

      {/* Map Modal*/}
      <Modal
        isVisible={mapIsVisible}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          margin: 0,
        }}
      >
        <Map
          modalHandler={() => toggleIsVisible(mapIsVisible, setMapIsVisible)}
          navigation={navigation}
          locationDataHandler={(value) => getLocationData(value)}
          searchedList={searchedList}
          setSearchedList={setSearchedList}
        />
      </Modal>
    </Modal>
  );
};

export default ToDoModal;
