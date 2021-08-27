import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { edit } from 'redux/store';
import { ModalLayout } from 'components/modal/ModalLayout';
import { remove } from 'redux/store';

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
  removeButtonText: {
    color: '#788382',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#707070',
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontWeight: '300',
  },
});

export const Task = (props) => {
  const { text: taskText, targetId, index } = props;
  const [taskTitle, setTaskTitle] = useState(taskText);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleRemoveButton, setIsVisibleRemoveButton] = useState(false);

  const dispatch = useDispatch();

  const toggleRemoveButton = () => {
    setIsVisibleRemoveButton(!isVisibleRemoveButton);
  };
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

  return (
    <>
      <View style={styles.taskContainer}>
        <TouchableHighlight
          onLongPress={() => toggleRemoveButton()}
          onPress={() => toggleIsVisible()}
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
              {taskText.length > 17 ? `${taskText.substr(0, 11)}...` : taskText}
            </Text>
            {isVisibleRemoveButton ? (
              <Text
                style={styles.removeButtonText}
                onPress={() => {
                  deleteTaskList(targetId, index);
                  toggleRemoveButton();
                }}
              >
                삭제
              </Text>
            ) : (
              <></>
            )}
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
