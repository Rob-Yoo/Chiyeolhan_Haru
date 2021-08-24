import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import Modal from 'react-native-modal';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { add, create } from 'redux/store';
import { dbService } from 'utils/firebase';
import { dbToAsyncStorage } from 'utils/AsyncStorage';

import Map from 'components/screen/Map';
import { TimePicker } from 'components/items/TimePicker';
import { TaskListModal } from 'components/modal/TaskListModal';

import { UID, TODAY } from 'constant/const';
import IconModalQuestion from '#assets/icons/icon-modal-question';
import { handleFilterData } from 'utils/handleFilterData';

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
    marginTop: '50%',
    backgroundColor: '#54BCB6',
    height: 320,
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
    fontSize: 20,
    marginBottom: 10,
  },
  modalInputContainer: {
    backgroundColor: '#e2ece9',
    marginTop: 200,
    height: 750,
    borderRadius: 50,
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
    marginVertical: 20,
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
    height: 200,
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

export const ToDoModal = ({
  createToDo,
  modalHandler,
  isModalVisible,
  navigation,
}) => {
  const [locationName, setLocationName] = useState(false);
  const [locationData, setLocationData] = useState({});
  const [inputIsVisible, setInputIsVisible] = useState(false);
  const [startTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [finishTimePickerVisible, setFinishTimePickerVisible] = useState(false);

  const [searchedList, setSearchedList] = useState([]);

  const [mapIsVisible, setMapIsVisible] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [task, setTask] = useState('');
  const { register, handleSubmit, setValue } = useForm();

  const toggleIsVisible = (isVisible, setVisible) => {
    setVisible(!isVisible);
  };
  const getLocationData = (value) => {
    setLocationData(value);
    setLocationName(value.location);
  };
  const clearData = () => {
    setLocationName(false);
    setTaskList([]);
  };
  const toDoSubmit = async ({ todoStartTime, todoFinishTime, todoTitle }) => {
    const { latitude, location, longitude, address } = locationData;
    const date = new Date();
    const todoId = `${date.getFullYear()}` + `${TODAY}` + `${todoStartTime}`;
    try {
      await dbService
        .collection(`${UID}`)
        .doc(`${todoId}`)
        .set({
          id: todoId,
          title: todoTitle,
          startTime: todoStartTime,
          finishTime: todoFinishTime,
          location,
          address,
          longitude,
          latitude,
          date: TODAY,
          toDos: [...taskList],
          isDone: false,
          isFavorite: false,
        });

      dbToAsyncStorage();
      // saveSearchedData({
      //   id: Date.now(),
      //   text: location,
      //   type: 'location',
      // });
      handleFilterData(location, 'location', searchedList, setSearchedList);

      const todo = [
        todoId,
        todoStartTime,
        todoFinishTime,
        todoTitle,
        TODAY,
        taskList,
        address,
        longitude,
        latitude,
        location,
      ];
      createToDo(todo);
      modalHandler();
    } catch (e) {
      console.log('toDoSumbit Error :', e);
    }
  };

  const taskSubmit = (data) => {
    const { todotask } = data;
    setTaskList((taskList) => [...taskList, todotask]);
    toggleIsVisible(inputIsVisible, setInputIsVisible);
  };
  //리스트에 추가할때
  // const completed = () => {
  //   console.log(id);
  //   id = id ?? Date.now();
  //   setToDoId(id);
  //   await dbService
  //     .collection(`${uid}`)
  //     .doc(`${id}`)
  //     .update({
  //       todos: [...taskList],
  //     });
  // };

  useEffect(() => {
    register('todoStartTime'),
      register('todoFinishTime'),
      register('todoTitle'),
      register('todoTask');
    register('todoId');
  }, [register]);

  return (
    <>
      <Modal
        navigation={navigation}
        isVisible={isModalVisible}
        style={{ margin: 0 }}
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
                  onPress={handleSubmit(toDoSubmit)}
                  style={styles.modalTopText}
                >
                  완료
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: 200,
                height: 200,
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: 100,
                paddingHorizontal: 65,
                paddingVertical: 40,
                marginBottom: 20,
              }}
            >
              <IconModalQuestion
                size={50}
                name="icon-modal-question"
                size={110}
                color={'#FFFFFF'}
                onPress={() => toggleIsVisible(mapIsVisible, setMapIsVisible)}
              />
            </View>
            <Text style={styles.modalLocationText}>
              {locationName ? locationName : '물음표를 눌러주세요'}
            </Text>
          </View>
          <View style={styles.timePickerContainer}>
            <TimePicker
              isVisible={startTimePickerVisible}
              setVisible={setStartTimePickerVisible}
              timeText={'시작'}
              pickerHandler={(text) => setValue('todoStartTime', text)}
            />
            <Text style={{ fontSize: 25 }}>~</Text>
            <TimePicker
              isVisible={finishTimePickerVisible}
              setVisible={setFinishTimePickerVisible}
              timeText={'끝'}
              pickerHandler={(text) => setValue('todoFinishTime', text)}
            />
          </View>
          <View style={styles.todoInputContainer}>
            <TextInput
              placeholder="제목을 입력해 주세요"
              style={styles.modalInputTitle}
              onChangeText={(text) => setValue('todoTitle', text)}
            ></TextInput>
            <TouchableOpacity
              style={styles.modalInputTask}
              onPress={() => toggleIsVisible(inputIsVisible, setInputIsVisible)}
            >
              <Text style={styles.modalInputText}>수행리스트</Text>
            </TouchableOpacity>
            <TaskListModal
              taskListHandler={(text) => {
                setValue('todotask', text);
                handleSubmit(taskSubmit);
              }}
              taskListVisibleHandler={() =>
                toggleIsVisible(inputIsVisible, setInputIsVisible)
              }
              taskSubmitHandler={handleSubmit(taskSubmit)}
              inputIsVisible={inputIsVisible}
              task={task}
            />
            <View style={styles.modalTaskContainer}>
              {taskList.map((item, index) => (
                <Text style={styles.modalInputText} key={index}>
                  {item}
                </Text>
              ))}
            </View>
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
function mapStateToProps(state) {
  return { toDos: state };
}
function mapDispatchToProps(dispatch) {
  return {
    createToDo: (todo) => dispatch(create(todo)),
    addToDo: (task, id) => dispatch(add({ task, id })),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ToDoModal);
