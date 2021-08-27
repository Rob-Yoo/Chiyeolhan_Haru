import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalInputTask: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 350,
    height: 60,
    marginBottom: 20,
  },
});

export const ToDoModalInput = (props) => {
  const [task, setTask] = useState('');
  const {
    inputIsVisible,
    taskSubmitHandler,
    taskListVisibleHandler,
    taskListHandler,
  } = props;

  return (
    <Modal
      style={{ margin: 0, alignItems: 'center' }}
      isVisible={inputIsVisible}
      avoidKeyboard
    >
      <TouchableOpacity
        style={styles.background}
        activeOpacity={1}
        onPress={taskListVisibleHandler}
      />
      <View>
        <TextInput
          onChangeText={(text) => {
            taskListHandler(text);
            setTask('');
            setTask(text);
          }}
          onSubmitEditing={() => {
            taskSubmitHandler(task);
            setTask('');
          }}
          style={styles.modalInputTask}
          returnKeyType="done"
          value={task}
        ></TextInput>
      </View>
    </Modal>
  );
};
