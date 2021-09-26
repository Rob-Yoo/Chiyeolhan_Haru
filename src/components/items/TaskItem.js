import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import { edit, remove } from 'redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { ModalLayout } from 'components/items/layout/ModalLayout';
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
    marginTop: 15,
  },
  task: {
    backgroundColor: '#FFF',
    width: '80%',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginLeft: 20,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 3.4,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    justifyContent: 'center',
    minHeight: 80,
  },
  taskText: {
    color: '#38504F',
    fontFamily: 'NotoSansKR-Bold',
  },
  modalInputTask: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: Dimensions.get('window').width * 0.8,
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
  const { text: taskText, targetId, index, canPress } = props;
  const todosSelector = useSelector(
    (state) => targetId !== 0 && state.toDos[targetId]?.toDos,
  );

  const network = useSelector((state) => state.network);
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

  useEffect(() => {
    todosSelector !== 0 && setTaskTitle(todosSelector[index]);
  }, [todosSelector]);
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
  );
};
