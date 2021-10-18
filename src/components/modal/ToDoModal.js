import React, { useEffect, useRef, useState } from 'react';
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  ImageBackground,
} from 'react-native';
import Modal from 'react-native-modal';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import { create, editToDoDispatch, deleteToDoDispatch } from 'redux/store';

import { todoDbModel } from 'model/dataModel';

import Map from 'components/screen/MapScreen';
import styles from 'components/modal/ToDoModalStyle';
import { TimePicker } from 'components/items/TimePicker';
import { ToDoModalInput } from 'components/modal/ToDoModalInput';
import { FavoriteModal } from 'components/modal/FavoriteModal';

import IconQuestion from '#assets/icons/icon-question';
import IconFavorite from '#assets/icons/icon-favorite';

import { handleFilterData } from 'utils/handleFilterData';
import {
  checkEarlistTodo,
  dbToAsyncStorage,
  dbToAsyncTomorrow,
  getDataFromAsync,
} from 'utils/asyncStorageUtil';
import { checkGeofenceSchedule } from 'utils/gfSchedulerUtil';
import {
  failNotification,
  cancelAllNotif,
  startNotification,
} from 'utils/notificationUtil';
import {
  alertInValidSubmit,
  alertStartTimeError,
  alertFinsihTimePicker,
  alertNotFillIn,
  longTaskList,
  longTodoTitle,
  addModifyBlockAlert,
} from 'utils/buttonAlertUtil';
import { getCurrentTime, getTimeDiff, getDate } from 'utils/timeUtil';
import { toDosUpdateDB } from 'utils/databaseUtil';

import {
  KEY_VALUE_TODAY_DATA,
  KEY_VALUE_START_TIME,
  KEY_VALUE_TOMORROW_DATA,
  KEY_VALUE_START_TODO,
  KEY_VALUE_SUCCESS,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from 'constant/const';

export const ToDoModal = ({
  modalHandler,
  isModalVisible,
  navigation,
  isToday,
  passModalData,
  setPassModalData,
  navigateFavorite = null,
}) => {
  const { TODAY, TOMORROW } = getDate();
  const dispatch = useDispatch();
  const network = useSelector((state) => state.network);
  const toDos = useSelector((state) => state.toDos);
  const [locationName, setLocationName] = useState('');
  const [locationData, setLocationData] = useState({});
  const [inputIsVisible, setInputIsVisible] = useState(false);
  const [searchedList, setSearchedList] = useState([]);
  const [mapIsVisible, setMapIsVisible] = useState(false);
  const [favoriteIsVisible, setFavoriteIsVisible] = useState(false);
  const [isOngoing, setIsOngoing] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [task, setTask] = useState(false);
  const [canEdit, setCanEdit] = useState(true);
  const [title, setTitle] = useState('');
  const { register, handleSubmit, setValue, unregister } = useForm();
  const titleRef = useRef();

  useEffect(() => {
    //수정시 넘겨온 데이터가 있을때
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
    register('todoStartTime');
    register('todoFinishTime');
    register('todoTitle');
    register('todoTask', { min: 1 });
    register('todoId');
  }, [register]);

  const handleIsOnGoing = () => {
    passModalData?.startDate < new Date() && setIsOngoing(true);
  };

  const handleChange = (e) => {
    setTitle(e.nativeEvent.text);
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
    unregister('todoStartTime');
    unregister('todoFinishTime');
    unregister('todoTitle');
    unregister('todoTask', { min: 1 });
    unregister('todoId');
    network !== 'offline' && setCanEdit(true);
  };

  const handleTodoSubmit = async ({
    todoStartTime,
    todoFinishTime,
    todoTitle,
  }) => {
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
      alertNotFillIn('일정의 시작 시간을 등록해주세요.');
    } else if (todoFinishTime === undefined) {
      alertNotFillIn('일정의 끝 시간을 등록해주세요.');
    } else if (todoTitle.length === 0) {
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
    if (todoStartTime >= todoFinishTime) {
      alertFinsihTimePicker('잘못된 시간 설정입니다.');
      return;
    }
    handleAlert(todoStartTime, todoFinishTime, todoTitle);
  };

  const handleAlert = async (todoStartTime, todoFinishTime, todoTitle) => {
    try {
      const toDoArray = isToday
        ? await getDataFromAsync(KEY_VALUE_TODAY_DATA)
        : await getDataFromAsync(KEY_VALUE_TOMORROW_DATA);
      let isNeedAlert = false;
      if (toDoArray != null) {
        if (toDoArray.length > 0) {
          // 추가하려는 일정이 시간표에 있는 일정들과 겹치는 지 검사
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
          //passModalData 수정일때
          !passModalData?.description
            ? await toDoSubmit(todoStartTime, todoFinishTime, todoTitle)
            : await toDoEdit(todoStartTime, todoFinishTime, todoTitle);
        }
      } else {
        //일정 생성 일때
        await toDoSubmit(todoStartTime, todoFinishTime, todoTitle);
      }
    } catch (e) {
      console.log('handleAlert Error :', e);
    }
  };

  const checkValidSubmit = (toDoArray, todoStartTime, todoFinishTime) => {
    // 추가하려는 일정이 시간표에 있는 일정들과 겹치는지 검사
    let isNeedAlert = false;

    for (const toDo of toDoArray) {
      const id = Object.keys(toDo);
      const startTime = toDo[id].startTime;
      const finishTime = toDo[id].finishTime;

      if (passModalData?.id !== id[0]) {
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
        if (startTime <= todoFinishTime && todoFinishTime <= finishTime) {
          isNeedAlert = true;
          break;
        }
      }
    }
    return isNeedAlert;
  };

  const toDoSubmit = async (startTime, finishTime, title) => {
    if (network === 'offline') {
      modalHandler();
      return;
    }
    const { latitude, location, longitude, address } =
      passModalData === undefined || passModalData?.description
        ? locationData
        : passModalData;
    const date = new Date();
    const id =
      `${date.getFullYear()}` +
      `${isToday ? TODAY : TOMORROW}` +
      `${startTime}`;
    const currentTime = getCurrentTime();
    const isStartTodo = await getDataFromAsync(KEY_VALUE_START_TODO);

    try {
      const newData = todoDbModel(
        id,
        title,
        startTime,
        finishTime,
        location,
        address,
        longitude,
        latitude,
        isToday,
        taskList,
      );
      dispatch(create(newData));
      await toDosUpdateDB(newData, id);

      if (isToday) {
        // 지금 추가하려는 일정이 제일 이른 시간이 아니라면 addGeofence를 하지 않게 하기 위해
        // 지금 추가하려는 일정의 시작 시간이 제일 이른 시간대인지 아닌지 isChangeEarliest로 판단하게 한다.
        const isChangeEarliest = await checkEarlistTodo(startTime);
        dbToAsyncStorage(isChangeEarliest); //isChangeEarliest가 true이면 addGeofence, 아니면 안함
        if (isStartTodo) {
          // 일정 시작 버튼이 눌렸을 때만 실패 알림 예약
          const timeDiff = getTimeDiff(currentTime, finishTime);
          failNotification(timeDiff, id);
        } else {
          // 일정 시작 버튼이 안눌렸을 때 시작 버튼 눌러달라는 알림 예약
          const timeDiff = getTimeDiff(currentTime, startTime);
          startNotification(timeDiff, id);
        }
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

  const toDoEdit = async (todoStartTime, todoFinishTime, todoTitle) => {
    if (network === 'offline') {
      modalHandler();
      return;
    }
    const block = await checkGeofenceSchedule();
    if (block == 1) {
      addModifyBlockAlert();
    } else {
      try {
        const isStartTodo = await getDataFromAsync(KEY_VALUE_START_TODO);
        const id = passModalData?.id;
        const startTime = passModalData?.startTime;

        let successSchedules = await getDataFromAsync(KEY_VALUE_SUCCESS);
        let newID;
        let isStartTimeChange = false;

        if (startTime !== todoStartTime) {
          // 시작시간이 바뀌면
          isStartTimeChange = true;
          const date = new Date();
          newID =
            `${date.getFullYear()}` +
            `${isToday ? TODAY : TOMORROW}` +
            `${todoStartTime}`;
          //newID 생성
          if (successSchedules !== null) {
            let idx = 0;
            let isNeedUpdate = false;
            for (const schedule of successSchedules) {
              if (schedule.id === id) {
                successSchedules[idx].id = newID;
                successSchedules[idx].startTime = todoStartTime;
                successSchedules[idx].finishTime = todoFinishTime;
                isNeedUpdate = true;
                break;
              }
              idx = idx + 1;
            }
            if (isNeedUpdate) {
              await AsyncStorage.setItem(
                KEY_VALUE_SUCCESS,
                JSON.stringify(successSchedules),
              );
              console.log('Updated successSchedules :', successSchedules);
            }
          }
        }

        if (isStartTimeChange) {
          const { location, longitude, latitude, address } = toDos[id];

          dispatch(deleteToDoDispatch(id));
          cancelAllNotif(id); //수정하려는 일정의 예약된 모든 알림 삭제

          const newData = todoDbModel(
            newID,
            todoTitle,
            todoStartTime,
            todoFinishTime,
            location,
            address,
            longitude,
            latitude,
            isToday,
            taskList,
          );
          dispatch(create(newData));
          await toDosUpdateDB(newData, newID);
        } else if (!isStartTimeChange) {
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
        if (isToday) {
          await dbToAsyncStorage(isChangeEarliest);

          const currentTime = getCurrentTime();

          if (isStartTodo) {
            // 시작 버튼이 눌렀을 경우에만 실패 알림 예약
            const timeDiff = getTimeDiff(currentTime, todoFinishTime);
            if (isStartTimeChange) {
              failNotification(timeDiff, newID); // 일정이 끝시간때에 실패 알림 예약
            } else {
              failNotification(timeDiff, id); // 일정이 끝시간때에 실패 알림 예약
            }
          } else {
            // 시작 버튼이 안 눌러젔을 경우에만 시작버튼 눌러달라는 알림 예약
            const timeDiff = getTimeDiff(currentTime, todoStartTime);
            if (isStartTimeChange) {
              startNotification(timeDiff, newID); // 시작 버튼 눌러달라는 알림 예약
            } else {
              startNotification(timeDiff, id);
            }
          }
        } else {
          dbToAsyncTomorrow();
        }
        modalHandler();
      } catch (e) {
        console.log('todoModal todoEdit Error', e);
      }
    }
  };

  const taskSubmit = ({ index, task }) => {
    if (task.length > 35) {
      longTaskList();
      toggleIsVisible(inputIsVisible, setInputIsVisible);
      return;
    }

    if (task.length === 0) {
      setTaskList([...taskList.slice(0, index), ...taskList.slice(index + 1)]);
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

  return (
    <Modal
      navigation={navigation}
      isVisible={isModalVisible}
      onModalHide={() => clearData()}
      style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, margin: 0 }}
    >
      <TouchableOpacity
        style={styles.background}
        activeOpacity={1}
        onPress={modalHandler}
      />
      <ImageBackground
        source={{ uri: 'favoriteBackground' }}
        imageStyle={{
          height: SCREEN_HEIGHT,
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
        }}
        style={styles.modalInputContainer}
      >
        <View style={styles.modalTopContainer}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 5,
              backgroundColor: 'transparent',
            }}
          >
            {isToday !== 'yesterday' && network !== 'offline' ? (
              <TouchableOpacity
                style={styles.favoriteIconBackground}
                onPress={() =>
                  toggleIsVisible(favoriteIsVisible, setFavoriteIsVisible)
                }
              >
                <IconFavorite
                  name="icon-favorite"
                  size={16}
                  color={'#00A29A'}
                />
              </TouchableOpacity>
            ) : (
              <View
                style={[
                  styles.favoriteIconBackground,
                  { backgroundColor: null },
                ]}
              />
            )}
            <View style={styles.modalTextView}>
              {canEdit ? (
                <>
                  <TouchableOpacity>
                    <Text
                      onPress={modalHandler}
                      style={[styles.modalTopText, { marginRight: 40 }]}
                    >
                      취소
                    </Text>
                  </TouchableOpacity>

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
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <ImageBackground
              style={[styles.imageBackgroundMapStyle]}
              source={{ uri: 'map' }}
            >
              <View
                style={[
                  styles.imageBackgroundStyle,
                  {
                    backgroundColor: locationName
                      ? 'transparent'
                      : 'rgba(0,0,0,0.3)',
                    borderWidth: locationName ? 8 : null,
                    borderColor: locationName ? '#EFEFEF' : null,
                  },
                ]}
              >
                {locationName ? (
                  <></>
                ) : (
                  <IconQuestion
                    name="icon-question"
                    size={SCREEN_HEIGHT > 668 ? 100 : 70}
                    color={'#FFFFFF'}
                    onPress={() =>
                      toggleIsVisible(mapIsVisible, setMapIsVisible)
                    }
                  />
                )}
              </View>
            </ImageBackground>
            <View>
              <Text style={styles.titleText}>제목</Text>
              {network === 'offline' ||
              (passModalData && passModalData.startDate < new Date()) ? (
                <View style={styles.modalInputTitle}>
                  <Text style={[styles.titleText, { color: '#2D2E33' }]}>
                    {title}
                  </Text>
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
              <Text style={styles.titleText}>위치</Text>
              <Text style={styles.modalLocationText}>
                {locationName
                  ? locationName.length > 11
                    ? `${locationName.substring(0, 12)}...`
                    : locationName
                  : '물음표를 눌러주세요'}
              </Text>
            </View>
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
            <Text
              style={{
                fontFamily: 'NotoSansKR-Black',
                fontSize: 18,
                color: '#fff',
                paddingHorizontal: 10,
              }}
            >
              ~
            </Text>
            <TimePicker
              isStart={false}
              timeText={'끝'}
              pickerHandler={(text) => timeHandler(text, false)}
              timeDate={passModalData?.endDate}
              isOngoing={isOngoing}
            />
          </View>
        </View>

        <View style={styles.todoBottomContainer}>
          <Text style={styles.taskTitle}>수행리스트</Text>
          <ScrollView
            contentContainerStyle={{
              width: '100%',
              paddingBottom: 300,
              alignItems: 'center',
            }}
          >
            {taskList.map((item, index) => (
              <TouchableOpacity
                style={styles.modalInputTask}
                key={`${item.id}${index}`}
                onPress={() =>
                  network === 'offline' ||
                  (!(isToday && passModalData?.startDate < new Date()) &&
                    editSchedule(item, index))
                }
              >
                <Text style={styles.modalInputText}>{item}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalInputTask}
              onPress={() =>
                network === 'offline' ||
                (!(isToday && passModalData?.startDate < new Date()) &&
                  toggleIsVisible(inputIsVisible, setInputIsVisible))
              }
            ></TouchableOpacity>
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
      </ImageBackground>

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
        backdropOpacity={0.3}
      >
        <Map
          modalHandler={() => toggleIsVisible(mapIsVisible, setMapIsVisible)}
          navigation={navigation}
          locationDataHandler={(value) => getLocationData(value)}
          searchedList={searchedList}
          setSearchedList={setSearchedList}
        />
      </Modal>

      {/* Favorite Modal*/}
      <Modal
        isVisible={favoriteIsVisible}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          margin: 0,
        }}
        backdropOpacity={0}
      >
        <TouchableOpacity
          style={[styles.background, { opacity: 0 }]}
          activeOpacity={0}
          onPress={() =>
            toggleIsVisible(favoriteIsVisible, setFavoriteIsVisible)
          }
        />
        <FavoriteModal
          modalHandler={() =>
            toggleIsVisible(favoriteIsVisible, setFavoriteIsVisible)
          }
          locationDataHandler={(value) => getLocationData(value)}
        />
      </Modal>
    </Modal>
  );
};

export default ToDoModal;
