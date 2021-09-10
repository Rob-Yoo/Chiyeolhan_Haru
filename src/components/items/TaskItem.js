import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableHighlight,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { edit } from 'redux/store';
import { ModalLayout } from 'components/items/layout/ModalLayout';
import { remove } from 'redux/store';
import { deleteToDoTaskList } from 'utils/TwoButtonAlert';

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
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export const Task = (props) => {
  const { text: taskText, targetId, index } = props;
  const todosSelector = useSelector(
    (state) => targetId !== 0 && state[targetId]?.toDos,
  );
  const [taskTitle, setTaskTitle] = useState(
    targetId !== 0 ? todosSelector[index] : null,
  );
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useDispatch();
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
    if (taskTitle.length > 0) editTaskList(targetId, taskTitle);
    else if (taskTitle.length === 0) deleteTaskList(targetId, index);
    toggleIsVisible();
  };
  const handleDeleteTaskList = () => {
    deleteTaskList(targetId, index);
  };

  useEffect(() => {
    todosSelector !== 0 && setTaskTitle(todosSelector[index]);
  }, [todosSelector]);

  return (
    <>
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
          onPress={() => targetId !== 0 && toggleIsVisible()}
          style={styles.task}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={styles.taskText}>
              {taskText?.length > 17
                ? `${taskText.substr(0, 11)}...`
                : taskText}
            </Text>
          </View>
        </TouchableHighlight>

        <ModalLayout
          isVisible={isVisible}
          taskListVisibleHandler={() => toggleIsVisible()}
          setHandler={() => setTaskTitle(taskTitle)}
        >
          <View>
            <TextInput
              onChangeText={(text) => {
                setTaskTitle(text);
              }}
              value={taskTitle}
              onSubmitEditing={() => {
                submitTask();
              }}
              style={styles.modalInputTask}
              returnKeyType="done"
            />
          </View>
        </ModalLayout>
      </View>
    </>
  );
};
