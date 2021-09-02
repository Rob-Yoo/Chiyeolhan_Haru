import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
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
import { connect } from 'react-redux';
import { add, create } from 'redux/store';
import AsyncStorage from '@react-native-community/async-storage';
import { dbToAsyncStorage, dbToAsyncTomorrow } from 'utils/AsyncStorage';
import Map from 'components/screen/Map';
import { TimePicker } from 'components/items/TimePicker';
import { ToDoModalInput } from 'components/modal/ToDoModalInput';
import IconQuestion from '#assets/icons/icon-question';
import {
  TODAY,
  TOMORROW,
  KEY_VALUE_GEOFENCE,
  KEY_VALUE_START_TIME,
  KEY_VALUE_TOMORROW,
} from 'constant/const';
import { editToDoDispatch } from 'redux/store';
import { makeNowTime } from 'utils/Time';
import { fontPercentage } from 'utils/responsive';
import { checkEarlistTodo } from 'utils/AsyncStorage';
import { handleFilterData } from 'utils/handleFilterData';
import {
  alertInValidSubmit,
  alertStartTimeError,
  alertNotFillIn,
} from 'utils/TwoButtonAlert';

export const ToDoModal = ({
  createToDo,
  editToDoDispatch,
  modalHandler,
  isModalVisible,
  navigation,
  isToday,
  passModalData,
  setPassModalData,
}) => {
  const [locationName, setLocationName] = useState('');
  const [locationData, setLocationData] = useState({});
  const [inputIsVisible, setInputIsVisible] = useState(false);
  const [searchedList, setSearchedList] = useState([]);
  const [mapIsVisible, setMapIsVisible] = useState(false);
  const [isTodoEdit, setIsTodoEdit] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [task, setTask] = useState('');
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
    let isChangeEarliest = true;
    // 지금 추가하려는 일정이 제일 이른 시간이 아니라면 addGeofence를 하지 않게 하기 위해
    // 지금 추가하려는 일정의 시작 시간이 제일 이른 시간대인지 아닌지 isChangeEarliest로 판단하게 한다.
    if (isToday) {
      checkEarlistTodo(todoStartTime);
    }
    try {
      isToday
        ? dbToAsyncStorage(isChangeEarliest) //isChangeEarliest가 true이면 addGeofence 아니면 안함
        : dbToAsyncTomorrow();

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
        isFavorite: false,
      };
      createToDo(newData);
      modalHandler();
      await AsyncStorage.removeItem(KEY_VALUE_START_TIME);
    } catch (e) {
      console.log('toDoSumbit second try catch Error :', e);
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
      // const startToFinTimeDiff = getTimeDiff(finishTime, todoStartTime);
      // const finToStartTimeDiff = getTimeDiff(todoFinishTime, startTime);
      if (
        !isTodoEdit &&
        startTime <= todoStartTime &&
        todoStartTime <= finishTime
      ) {
        isNeedAlert = true;
        return;
      }

      if (
        !isTodoEdit &&
        startTime <= todoFinishTime &&
        todoFinishTime <= finishTime
      ) {
        isNeedAlert = true;
        return;
      }
    });
    return isNeedAlert;
  };

  const handleTodayTodoSubmit = async (
    todoStartTime,
    todoFinishTime,
    todoTitle,
    isTodoEdit,
  ) => {
    const currentTime = makeNowTime();
    if (!isTodoEdit && currentTime > todoStartTime) {
      alertStartTimeError();
      modalHandler();
      return;
    }
    try {
      const result = await AsyncStorage.getItem(KEY_VALUE_GEOFENCE);
      let isNeedAlert = false;
      if (result != null) {
        const toDoArray = JSON.parse(result);
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
          toDoSubmit(todoStartTime, todoFinishTime, todoTitle);
        }
      } else {
        toDoSubmit(todoStartTime, todoFinishTime, todoTitle);
      }
    } catch (e) {
      console.log('handleTodayTodoSubmit Error :', e);
    }
  };

  const handleTomorrowTodoSubmit = async (
    todoStartTime,
    todoFinishTime,
    todoTitle,
  ) => {
    try {
      const result = await AsyncStorage.getItem(KEY_VALUE_TOMORROW);
      let isNeedAlert = false;
      if (result != null) {
        const toDoArray = JSON.parse(result);
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
          toDoSubmit(todoStartTime, todoFinishTime, todoTitle);
        }
      } else {
        toDoSubmit(todoStartTime, todoFinishTime, todoTitle);
      }
    } catch (e) {
      console.log('handleTomorrowTodoSubmit Error :', e);
    }
  };
  const handleEditSubmit = async (todoStartTime, todoFinishTime, todoTitle) => {
    const id = passModalData?.id;
    const currentTime = makeNowTime();
    if (!isTodoEdit && currentTime > todoStartTime) {
      alertStartTimeError();
      modalHandler();
      return;
    }
    editToDoDispatch(
      { todoTitle, todoStartTime, todoFinishTime, taskList },
      id,
    );

    //오늘의 첫번째 일정일때는dbToAsyncStorage(true);
    isToday && checkEarlistTodo(todoStartTime);
    isToday ? dbToAsyncStorage(isChangeEarliest) : dbToAsyncTomorrow();
    modalHandler();
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
      if (!isTodoEdit && isToday) {
        handleTodayTodoSubmit(todoStartTime, todoFinishTime, todoTitle);
      } else if (!isTodoEdit && !isToday) {
        handleTomorrowTodoSubmit(todoStartTime, todoFinishTime, todoTitle);
      } else if (isTodoEdit) {
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

  const timeHandler = (text, isStart) => {
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
      setValue('todoStartTime', newTime);
    } else {
      setValue('todoFinishTime', newTime);
    }
  };

  useEffect(() => {
    register('todoStartTime'),
      register('todoFinishTime'),
      register('todoTitle'),
      register('todoTask');
    register('todoId');
  }, [register]);
  useEffect(() => {
    if (passModalData !== undefined) {
      setLocationName(passModalData.location);
      setTitle(passModalData.description);
      setTaskList([...passModalData.toDos]);
      setLocationData(passModalData.location);
      setIsTodoEdit(true);
    } else {
      setIsTodoEdit(false);
    }
  }, [passModalData]);
  return (
    <>
      <Modal
        navigation={navigation}
        isVisible={isModalVisible}
        style={{ margin: 0, flex: 1 }}
        onModalHide={() => clearData()}
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
              style={{
                width: Dimensions.get('window').height > 667 ? 200 : 150,
                height: Dimensions.get('window').height > 667 ? 200 : 150,
                borderRadius: 100,
              }}
              source={{ uri: 'map' }}
            >
              <View
                style={{
                  width: Dimensions.get('window').height > 667 ? 200 : 150,
                  height: Dimensions.get('window').height > 667 ? 200 : 150,
                  borderRadius: 100,
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  paddingHorizontal:
                    Dimensions.get('window').height > 667 ? '33%' : '35%',
                  paddingVertical: 40,
                  marginBottom: 20,
                }}
              >
                {locationName ? (
                  <></>
                ) : (
                  <IconQuestion
                    name="icon-question"
                    size={Dimensions.get('window').height > 667 ? 110 : 70}
                    color={'#FFFFFF'}
                    onPress={() =>
                      toggleIsVisible(mapIsVisible, setMapIsVisible)
                    }
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
              isTodoEdit={isTodoEdit}
              isStart={true}
              timeText={'시작'}
              pickerHandler={(text) => timeHandler(text, true)}
              isToday={isToday}
              timeDate={passModalData?.startDate}
            />
            <Text style={{ fontSize: 25 }}>~</Text>
            <TimePicker
              isTodoEdit={{ isTodoEdit }}
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
                  onPress={() => {
                    setTask([item, index]);
                    toggleIsVisible(inputIsVisible, setInputIsVisible);
                  }}
                >
                  <Text style={styles.modalInputText}>{item}</Text>
                </TouchableWithoutFeedback>
              ))}
            </ScrollView>
            <ToDoModalInput
              taskListVisibleHandler={() =>
                toggleIsVisible(inputIsVisible, setInputIsVisible)
              }
              taskSubmitHandler={taskSubmit}
              inputIsVisible={inputIsVisible}
              prevTask={task}
              setPrevTask={setTask}
            />
          </View>
          <Modal
            isVisible={mapIsVisible}
            animationIn="slideInRight"
            animationOut="slideOutRight"
          >
            <Map
              modalHandler={() =>
                toggleIsVisible(mapIsVisible, setMapIsVisible)
              }
              navigation={navigation}
              locationDataHandler={(value) => getLocationData(value)}
              searchedList={searchedList}
              setSearchedList={setSearchedList}
            />
          </Modal>
        </View>
      </Modal>
    </>
  );
};
const mapStateToProps = (state) => {
  return { toDos: state };
};
const mapDispatchToProps = (dispatch) => {
  return {
    createToDo: (todo) => dispatch(create(todo)),
    addToDo: (task, id) => dispatch(add({ task, id })),
    editToDoDispatch: (data, id) => dispatch(editToDoDispatch({ data, id })),
  };
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'transparent',
  },
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  toDoModalContainer: {
    flex: 1,
    justifyContent: 'center',
    margin: 0,
  },
  modalTopContainer: {
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#54BCB6',
    height: Dimensions.get('window').height > 667 ? '40%' : '45%',
    // height: 320,
    borderRadius: 50,
    marginTop: -10,
  },
  modalTextView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
    marginTop: 20,
  },
  modalTopText: {
    fontFamily: 'NotoSansKR-Bold',
    color: '#FFFFFF',
    fontSize: 20,
  },
  modalLocationText: {
    fontFamily: 'NotoSansKR-Regular',
    color: '#FFFFFF',
    fontSize: fontPercentage(20),
  },
  modalInputContainer: {
    backgroundColor: '#e2ece9',
    marginTop: '40%',
    height: Dimensions.get('window').height / 1.2,
    // height: 750,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  modalInput1: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginRight: 20,
    width: 165,
    height: 40,
  },
  modalInput2: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 165,
    height: 40,
    marginBottom: 10,
  },
  modalInputTitle: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 350,
    height: 40,
    marginBottom: 10,
  },
  modalInputTask: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 350,
    height: 40,
    marginBottom: 20,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 3.4,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  modalInputText: {
    color: '#B7B7B7',
    marginVertical: 10,
  },
  timePickerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  todoInputContainer: {
    alignItems: 'center',
    shadowColor: '#00000029',
    shadowOffset: {
      width: 3.4,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  modalTaskContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 350,
    height: Dimensions.get('window').height > 667 ? 200 : 100,
    marginBottom: 20,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 3.4,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ToDoModal);
