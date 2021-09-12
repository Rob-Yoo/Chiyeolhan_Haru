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
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { create, editToDoDispatch } from 'redux/store';
import Map from 'components/screen/Map';
import { TimePicker } from 'components/items/TimePicker';
import { ToDoModalInput } from 'components/modal/ToDoModalInput';
import IconQuestion from '#assets/icons/icon-question';
import { handleFilterData } from 'utils/handleFilterData';
import {
  TODAY,
  TOMORROW,
  KEY_VALUE_TODAY,
  KEY_VALUE_START_TIME,
  KEY_VALUE_TOMORROW,
} from 'constant/const';
import {
  checkEarlistTodo,
  dbToAsyncStorage,
  dbToAsyncTomorrow,
  getDataFromAsync,
} from 'utils/AsyncStorage';
import {
  alertInValidSubmit,
  alertStartTimeError,
  alertNotFillIn,
} from 'utils/TwoButtonAlert';
import styles from 'components/modal/ToDoModalStyle';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'components/screen/Home';
import { getCurrentTime } from 'utils/Time';

export const ToDoModal = ({
  modalHandler,
  isModalVisible,
  navigation,
  isToday,
  passModalData,
  setPassModalData,
}) => {
  const dispatch = useDispatch();
  const [locationName, setLocationName] = useState('');
  const [locationData, setLocationData] = useState({});
  const [inputIsVisible, setInputIsVisible] = useState(false);
  const [searchedList, setSearchedList] = useState([]);
  const [mapIsVisible, setMapIsVisible] = useState(false);

  const [taskList, setTaskList] = useState([]);
  const [task, setTask] = useState(false);
  const [title, setTitle] = useState('');
  const { register, handleSubmit, setValue } = useForm();
  const titleRef = useRef();

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
  };

  const toDoSubmit = async (todoStartTime, todoFinishTime, todoTitle) => {
    const { latitude, location, longitude, address } = locationData;
    const date = new Date();
    const todoId =
      `${date.getFullYear()}` +
      `${isToday ? TODAY : TOMORROW}` +
      `${todoStartTime}`;
    // 지금 추가하려는 일정이 제일 이른 시간이 아니라면 addGeofence를 하지 않게 하기 위해
    // 지금 추가하려는 일정의 시작 시간이 제일 이른 시간대인지 아닌지 isChangeEarliest로 판단하게 한다.
    try {
      if (isToday) {
        const isChangeEarliest = await checkEarlistTodo(todoStartTime);
        dbToAsyncStorage(isChangeEarliest); //isChangeEarliest가 true이면 addGeofence 아니면 안함
      } else {
        dbToAsyncTomorrow();
      }

      await handleFilterData(
        location,
        'location',
        searchedList,
        setSearchedList,
      );

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
    toDoArray.forEach((toDo) => {
      const startTime = toDo.startTime;
      const finishTime = toDo.finishTime;
      if (
        passModalData?.id !== toDo.id &&
        startTime <= todoStartTime &&
        todoStartTime <= finishTime
      ) {
        isNeedAlert = true;
        return isNeedAlert;
      }
      if (
        passModalData?.id !== toDo.id &&
        startTime <= todoFinishTime &&
        todoFinishTime <= finishTime
      ) {
        isNeedAlert = true;
        return isNeedAlert;
      }
    });
    return isNeedAlert;
  };

  const todoEdit = async (todoStartTime, todoFinishTime, todoTitle) => {
    const id = passModalData?.id;
    dispatch(
      editToDoDispatch({
        todoTitle,
        todoStartTime,
        todoFinishTime,
        taskList,
        id,
      }),
    );
    try {
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
        ? await getDataFromAsync(KEY_VALUE_TODAY)
        : await getDataFromAsync(KEY_VALUE_TOMORROW);
      let isNeedAlert = false;
      if (toDoArray != null) {
        if (toDoArray.length != 0) {
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
          !passModalData
            ? await toDoSubmit(todoStartTime, todoFinishTime, todoTitle)
            : await todoEdit(todoStartTime, todoFinishTime, todoTitle);
        }
      } else {
        await toDoSubmit(todoStartTime, todoFinishTime, todoTitle);
      }
    } catch (e) {
      console.log('handleTodayTodoSubmit Error :', e);
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
    if (Object.keys(locationData).length == 0) {
      alertNotFillIn('일정 장소를 등록해주세요.');
    } else if (todoStartTime === undefined) {
      alertNotFillIn('일정의 시작시간을 등록해주세요.');
    } else if (todoFinishTime === undefined) {
      alertNotFillIn('일정의 끝시간을 등록해주세요.');
    } else if (todoTitle === undefined) {
      alertNotFillIn('일정의 제목을 입력해주세요');
    } else {
      if (!passModalData && isToday) {
        //모달에 데이터가 없을때, 즉 일정을 새로 추가할때(오늘)
        handleTodayTodoSubmit(todoStartTime, todoFinishTime, todoTitle);
      } else if (!passModalData && !isToday) {
        //모달에 데이터가 없을때, 즉 일정을 새로 추가할때(내일)
        handleTomorrowTodoSubmit(todoStartTime, todoFinishTime, todoTitle);
      } else if (passModalData) {
        //모달에 데이터가 있을때, 즉 일정을 수정할때
        handleEditSubmit(todoStartTime, todoFinishTime, todoTitle);
      }
    }
  };

  const taskSubmit = ({ index, task }) => {
    if (index === false) {
      setTaskList([...taskList, task]);
    } else {
      setTaskList([
        ...taskList.slice(0, index),
        task,
        ...taskList.slice(index + 1),
      ]);
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

  useEffect(() => {
    //수정시 넘겨온 데이터가 있을때
    if (passModalData !== undefined) {
      setLocationName(passModalData.location);
      setTitle(passModalData.description);
      setTaskList([...passModalData.toDos]);
      setLocationData(passModalData.location);
    }
  }, [passModalData]);
  useEffect(() => {
    register('todoStartTime'),
      register('todoFinishTime'),
      register('todoTitle'),
      register('todoTask'),
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
          />
          <Text style={{ fontSize: 25 }}>~</Text>
          <TimePicker
            isStart={false}
            timeText={'끝'}
            pickerHandler={(text) => timeHandler(text, false)}
            timeDate={passModalData?.endDate}
          />
        </View>
        <View style={styles.todoInputContainer}>
          <TextInput
            placeholder="제목을 입력해 주세요"
            style={styles.modalInputTitle}
            value={title}
            ref={titleRef}
            onChange={(e) => handleChange(e)}
            onChangeText={setValue('todoTitle', title)}
          />
          <TouchableOpacity
            style={styles.modalInputTask}
            onPress={() => toggleIsVisible(inputIsVisible, setInputIsVisible)}
          >
            <Text style={styles.modalInputText}>수행리스트</Text>
          </TouchableOpacity>

          <ScrollView style={styles.modalTaskContainer}>
            {taskList.map((item, index) => (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => editSchedule(item, index)}
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
