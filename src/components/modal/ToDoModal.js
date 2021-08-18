import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  Modal,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { TouchableOpacity, View, Text } from 'react-native';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { add, create } from 'redux/store';
import { dbService } from 'utils/firebase';

import IconModalQuestion from '#assets/icons/icon-modal-question';
import { UID } from 'constant/const';
import { dbToAsyncStorage } from 'utils/AsyncStorage';
import { TODAY } from 'constant/const';

const styles = StyleSheet.create({
  toDoModalContainer: { flex: 1, justifyContent: 'center' },
  modalTopContainer: {
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: '#54BCB6',
    width: '100%',
    height: 350,
    borderRadius: 50,
    padding: 40,
  },
  modalTextView: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalTopText: {
    fontFamily: 'NotoSansKR-Bold',
    color: '#FFFFFF',
  },
  modalLocationText: {
    fontFamily: 'NotoSansKR-Regular',
    color: '#FFFFFF',
    fontSize: 20,
  },
  modalInputContainer: {
    flex: 1,
    backgroundColor: '#ECF5F471',
    alignItems: 'center',
    marginTop: 150,
    paddingTop: 400,
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
  },
});

function ToDoModal({ createToDo, navigation, route }) {
  const location = route.params?.locationData?.location ?? false;
  const locationData = location
    ? route.params?.locationData ?? false
    : undefined;
  const { register, handleSubmit, setValue } = useForm();
  const [taskList, setTaskList] = useState([]);
  const [targetId, setTargetId] = useState('?');
  const [task, setTask] = useState('');
  const goBack = () => {
    navigation.popToTop();
  };
  const goToMap = () => navigation.navigate('Map');
  const dismissKeyboard = () => {
    console.log('dismiss');
    Keyboard.dismiss();
  };
  const toDoSubmit = async (data) => {
    const { todostarttime, todofinishtime, todotitle } = data;
    const { latitude, location, longitude, address } = locationData;
    // const isFirstSubmit = await checkFirstSubmit();
    const todosRef = dbService.collection(`${UID}`);
    const date = new Date();
    const toDoId = `${date.getFullYear()}` + `${TODAY}` + `${todostarttime}`;
    try {
      await dbService
        .collection(`${UID}`)
        .doc(`${toDoId}`)
        .set({
          id: toDoId,
          title: todotitle,
          starttime: todostarttime,
          finishtime: todofinishtime,
          location,
          address,
          longitude,
          latitude,
          date: TODAY,
          todos: [...taskList],
          isdone: false,
          isfavorite: false,
        });

      dbToAsyncStorage(todosRef);

      const todo = [
        toDoId,
        todostarttime,
        todofinishtime,
        todotitle,
        TODAY,
        taskList,
        address,
        longitude,
        latitude,
        location,
      ];
      createToDo(todo);
    } catch (e) {
      console.log('toDoSumbit Error :', e);
    }
  };
  const taskSubmit = (data) => {
    const { todotask } = data;
    setTaskList((taskList) => [...taskList, todotask]);
    //setTargetId(toDoId);
    //addToDo(todotask, toDoId);
    setTask('');
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
  useEffect(
    () => {}, //getToDoId()
    [],
  );

  useEffect(() => {
    register('todostarttime'),
      register('todofinishtime'),
      register('todotitle'),
      register('todotask');
    register('todoid');
  }, [register]);

  return (
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={dismissKeyboard}>
      <View style={styles.toDoModalContainer}>
        <View style={styles.modalInputContainer}>
          <View style={styles.modalTopContainer}>
            <View style={styles.modalTextView}>
              <Text style={styles.modalTopText} onPress={goBack}>
                취소
              </Text>
              <Text
                onPress={() => {
                  navigation.goBack();
                }}
                style={styles.modalTopText}
              >
                완료
              </Text>
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
                onPress={goToMap}
              />
            </View>
            <Text style={styles.modalLocationText}>
              {location ? location : '물음표를 눌러주세요'}
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <TextInput
              style={styles.modalInput1}
              placeholder="시작시간:00:00"
              onChangeText={(text) => setValue('todostarttime', text)}
            ></TextInput>
            <TextInput
              style={styles.modalInput2}
              placeholder="마칠시간:00:00"
              onChangeText={(text) => setValue('todofinishtime', text)}
            ></TextInput>
          </View>
          <TextInput
            placeholder="제목을 입력해 주세요"
            style={styles.modalInputTitle}
            onChangeText={(text) => setValue('todotitle', text)}
          ></TextInput>
          <TouchableOpacity onPress={handleSubmit(toDoSubmit)}>
            <Text>추가</Text>
          </TouchableOpacity>
          <TextInput
            placeholder="수행리스트"
            onChangeText={(text) => {
              setTask(text);
              setValue('todotask', text);
            }}
            style={styles.modalInputTask}
            returnKeyType="done"
            value={task}
            onSubmitEditing={handleSubmit(taskSubmit)}
          ></TextInput>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
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
