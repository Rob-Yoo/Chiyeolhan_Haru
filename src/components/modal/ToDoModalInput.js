import React, { useEffect, useState } from 'react';
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
  const {
    inputIsVisible,
    taskSubmitHandler,
    taskListVisibleHandler,
    prevTask,
    setPrevTask,
  } = props;
  const [task, setTask] = useState('');

  useEffect(() => {
    prevTask && setTask(prevTask.item);
  }, []);

  const handleText = (text) => {
    setTask(text);
  };
  return (
    <Modal
      style={{ margin: 0, alignItems: 'center' }}
      isVisible={inputIsVisible}
      onModalHide={() => setPrevTask('')}
      avoidKeyboard
    >
      <TouchableOpacity
        style={styles.background}
        activeOpacity={1}
        onPress={taskListVisibleHandler}
      />
      <View>
        <TextInput
          onChangeText={(task) => handleText(task)}
          onSubmitEditing={() => {
            taskSubmitHandler({
              task,
              index: prevTask ? prevTask.index : false,
            });
            setTask('');
          }}
          style={styles.modalInputTask}
          returnKeyType="done"
          value={task}
        />
      </View>
    </Modal>
  );
};
