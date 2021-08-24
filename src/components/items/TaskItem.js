import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';

import { useDispatch, useSelector } from 'react-redux';
import { edit } from 'redux/store';
import { ModalLayout } from '../modal/ModalLayout';

const styles = StyleSheet.create({
  taskHeader: {
    top: 0,
    paddingHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
    flexShrink: 0,
  },
  taskContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
    maxHeight: 100,
  },
  task: {
    backgroundColor: '#FFF',
    width: '80%',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginLeft: 20,
    paddingVertical: 20,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 3.4,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  taskText: {
    maxWidth: '100%',
    color: '#38504F',
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 20,
  },
  modalInputTask: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 350,
    height: 60,
    marginBottom: 20,
  },
});

export const Task = (props) => {
  const { text: taskText, targetId, index } = props;
  const [taskTitle, setTaskTitle] = useState(taskText);
  const [isVisibe, setIsVisible] = useState(false);
  const dispatch = useDispatch();

  const toggleIsVisible = () => {
    console.log('press');

    setIsVisible(!isVisibe);
  };
  const editTaskList = (targetId, taskTitle) => {
    console.log(taskTitle, index, targetId);
    dispatch(edit({ targetId, taskTitle, index }));
  };

  return (
    <>
      <View style={styles.taskContainer}>
        <View style={styles.task}>
          <Text style={styles.taskText} onPress={() => toggleIsVisible()}>
            {taskText.length > 17 ? `${taskText.substr(0, 16)}...` : taskText}
          </Text>
        </View>

        <ModalLayout isVisibe={isVisibe}>
          <TextInput
            onChangeText={(text) => {
              setTaskTitle(text);
            }}
            value={taskTitle}
            onSubmitEditing={() => {
              toggleIsVisible();
              editTaskList(targetId, taskTitle);
            }}
            style={styles.modalInputTask}
            returnKeyType="done"
          />
          <Text onPress={() => {}} style={styles.modalAdd}>
            추가
          </Text>
        </ModalLayout>
      </View>
    </>
  );
};
