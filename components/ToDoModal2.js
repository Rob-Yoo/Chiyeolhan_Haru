import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  Modal,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { add, create } from '../redux/store';
import { dbService } from '../firebase';
import styled from 'styled-components/native';

import IconModalQuestion from '../assets/icons/icon-modal-question';
const uid = DeviceInfo.getUniqueId();

const TodoModal = styled.View`
  flex: 1;
  justify-content: center;
`;
const styles = StyleSheet.create({
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
  modalinputcontainer: {
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
  },
  modalInputTask: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 350,
    height: 40,
  },
});
function ToDoModal({ createToDo, addToDo, navigation, route }) {
  const name = route.params?.locationDatas.name ?? false;
  const locationData = name ? route.params.locationDatas : undefined;
  const { register, handleSubmit, setValue } = useForm();
  const [taskList, setTaskList] = useState([]);
  const [targetId, setTargetId] = useState('?');
  const [task, setTask] = useState('');
  const goBack = () => {
    console.log(navigation);
    navigation.popToTop();
  };
  const goToMap = () => navigation.navigate('Map');
  const dismissKeyboard = () => {
    console.log('dismiss');
    Keyboard.dismiss();
  };

  const titleSubmit = async (data) => {
    const { todostarttime, todofinishtime, todotitle } = data;
    const id = Date.now();
    const date = new Date();
    let today =
      (date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1) +
      (date.getDay() < 10 ? `0${date.getDay() + 1}` : date.getDay());

    setValue('todoid', id);
    await dbService.collection(`${uid}`).doc(`${id}`).set({
      id,
      title: todotitle,
      starttime: todostarttime,
      finishtime: todofinishtime,
      location: name,
      longitude: '경도',
      latitude: '위도',
      date: today,
      todos: [],
    });
    const todo = [id, todostarttime, todofinishtime, todotitle, today];
    createToDo(todo);
  };
  const taskSubmit = (data) => {
    const { todotask, todoid } = data;
    setTaskList((taskList) => [...taskList, todotask]);
    setTargetId(todoid);
    addToDo(todotask, todoid);
    setTask('');
  };
  const completed = async () => {
    await dbService
      .collection(`${uid}`)
      .doc(`${targetId}`)
      .update({
        todos: [...taskList],
      });
  };

  useEffect(() => {
    register('todostarttime'),
      register('todofinishtime'),
      register('todotitle'),
      register('todoid');
    register('todotask');
  }, [register]);

  return (
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={dismissKeyboard}>
      <TodoModal>
        <View style={styles.modalinputcontainer}>
          <View style={styles.modalTopContainer}>
            <View style={styles.modalTextView}>
              <Text style={styles.modalTopText} onPress={goBack}>
                취소
              </Text>
              <Text
                onPress={() => {
                  completed();
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
              {name ? name : '물음표를 눌러주세요'}
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
          <TouchableOpacity onPress={handleSubmit(titleSubmit)}>
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
      </TodoModal>
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
