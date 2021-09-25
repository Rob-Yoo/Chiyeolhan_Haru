import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';

import { add } from 'redux/store';

import { Task } from 'components/items/TaskItem';
import { ModalLayout } from 'components/items/layout/ModalLayout';

import IconTaskListAdd from '#assets/icons/icon-tasklist-add-button';
import IconTaskListLeft from '#assets/icons/icon-tasklist-left';
import IconTaskListLeftFin from '#assets/icons/icon-tasklist-left-fin';

import { getCurrentTime } from 'utils/Time';

const Pagination = ({ taskList, targetId }) => {
  const network = useSelector((state) => state.network);
  const toDos = useSelector((state) => state.toDos[targetId]);
  const [isVisible, setIsVisible] = useState(false);
  const [taskTitle, setTaskTitle] = useState(null);
  const dispatch = useDispatch();

  const toggleIsVisible = () => {
    setIsVisible(!isVisible);
  };

  const addTaskList = () => {
    toggleIsVisible();
    if (taskTitle !== null && taskTitle.length > 0)
      dispatch(add({ targetId, taskTitle }));
    setTaskTitle(null);
  };

  return (
    <View style={styles.paginationStyle}>
      <View style={styles.taskHeader}>
        <Text
          style={{
            color: '#229892',
            fontFamily: 'NotoSansKR-Bold',
            fontSize: 22,
            marginRight: 10,
          }}
        >
          수행 리스트
        </Text>
        {network !== 'offline' ? (
          <IconTaskListAdd
            name="icon-tasklist-add-button"
            size={19}
            color={'#229892'}
            onPress={() =>
              targetId !== 0 &&
              network === 'online' &&
              toDos.startTime > getCurrentTime() &&
              toggleIsVisible()
            }
          />
        ) : null}
      </View>
      <ScrollView
        style={{
          height: '100%',
          maxHeight: 700,
          flexGrow: 0,
          // paddingHorizontal: 20,
        }}
      >
        {taskList &&
          taskList.map((item, index) => {
            return (
              <View key={`T` + targetId + index}>
                {index === 0 ? (
                  <IconTaskListLeft
                    name="icon-tasklist-left"
                    size={105}
                    color="#707070"
                    style={{ position: 'absolute', left: -35, top: 0 }}
                  />
                ) : (
                  <IconTaskListLeftFin
                    name="icon-tasklist-left-fin"
                    size={105}
                    color="#707070"
                    style={{ position: 'absolute', left: -35, top: 0 }}
                  />
                )}
                <Task
                  index={index}
                  text={item}
                  targetId={targetId}
                  canPress={
                    targetId !== 0 &&
                    network === 'online' &&
                    toDos.startTime > getCurrentTime()
                  }
                />
              </View>
            );
          })}
      </ScrollView>

      <ModalLayout
        isVisible={isVisible}
        taskListVisibleHandler={() => toggleIsVisible()}
      >
        <View>
          <TextInput
            onChangeText={(text) => {
              setTaskTitle(text);
            }}
            onSubmitEditing={() => {
              addTaskList(targetId, taskTitle);
            }}
            style={styles.modalInputTask}
            returnKeyType="done"
          />
        </View>
      </ModalLayout>
    </View>
  );
};

export const renderPagination = (index, total, context) => {
  if (context.props.toDos[index] !== undefined) {
    const taskList = context?.props?.toDos[index].toDos;
    const targetId = context?.props?.toDos[index].id;
    return <Pagination taskList={taskList} targetId={targetId} />;
  }
};

const styles = StyleSheet.create({
  taskHeader: {
    paddingHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10,
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
  paginationStyle: {
    position: 'absolute',
    top: 300,
    left: -50,
    width: 400,
    height: '100%',
  },
});
