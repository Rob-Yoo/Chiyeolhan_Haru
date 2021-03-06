import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableHighlight,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { edit, remove } from 'redux/store';

import { ModalLayout } from 'components/items/layout/ModalLayout';

import { deleteToDoTaskList, longTaskList } from 'utils/buttonAlertUtil';

export const Task = (props) => {
  const { text: taskText, targetId, index, canPress, taskStyle } = props;
  const todosSelector = useSelector(
    (state) => targetId !== 0 && state.toDos[targetId]?.toDos,
  );
  const network = useSelector((state) => state.network);
  const [taskTitle, setTaskTitle] = useState(
    targetId !== 0 ? todosSelector[index] : null,
  );
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    todosSelector !== 0 && setTaskTitle(todosSelector[index]);
  }, [todosSelector]);

  const toggleIsVisible = () => {
    setIsVisible(!isVisible);
  };
  const editTaskList = (targetId, taskTitle) => {
    dispatch(edit({ targetId, taskTitle, index }));
  };
  const deleteTaskList = (targetId, index) => {
    dispatch(remove({ targetId, index }));
  };
  const submitTask = () => {
    if (taskTitle.length > 40) {
      longTaskList();
      return;
    }
    if (taskTitle.length > 0 && taskTitle !== null)
      editTaskList(targetId, taskTitle);
    else if (taskTitle.length === 0) {
      deleteTaskList(targetId, index);
      setTaskTitle(null);
    }
    toggleIsVisible();
  };
  const handleDeleteTaskList = () => {
    deleteTaskList(targetId, index);
  };

  return (
    <View style={styles.taskContainer}>
      <TouchableHighlight
        underlayColor="rgba(0, 0, 0, 0.2)"
        onLongPress={async () => {
          try {
            if (targetId !== 0) {
              if ((await deleteToDoTaskList(targetId)) === 'true')
                handleDeleteTaskList(targetId, index);
            }
          } catch (e) {
            console.log('task list delete error', e);
          }
        }}
        onPress={() =>
          targetId !== 0 &&
          network === 'online' &&
          canPress &&
          toggleIsVisible()
        }
        style={[styles.task, { paddingVertical: 10 }]}
      >
        <View
          style={{
            alignItems: 'center',
            width: '100%',
            flexWrap: 'wrap',
          }}
        >
          <Text
            style={[
              styles.taskText,
              { fontSize: taskText.length > 45 ? 13 : 17 },
            ]}
          >
            {taskText}
          </Text>
        </View>
      </TouchableHighlight>

      <ModalLayout
        isVisible={isVisible}
        taskListVisibleHandler={() => toggleIsVisible()}
        setHandler={() => setTaskTitle(taskTitle)}
      >
        <TextInput
          onChangeText={(text) => {
            setTaskTitle(text);
          }}
          value={taskTitle}
          onSubmitEditing={() => {
            submitTask();
          }}
          style={taskStyle}
          returnKeyType="done"
        />
      </ModalLayout>
    </View>
  );
};

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
    alignItems: 'center',
    maxHeight: 100,
    marginTop: 10,
  },
  task: {
    backgroundColor: '#FFF',
    width: '75%',
    height: 74,
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginLeft: 18,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 3.4,
      height: 5,
    },
    shadowOpacity: 0.6,
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
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
