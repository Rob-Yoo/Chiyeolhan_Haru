import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';

import { add } from 'redux/store';

import { Task } from 'components/items/TaskItem';
import { ModalLayout } from 'components/items/layout/ModalLayout';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'constant/const';

import IconTaskListAdd from '#assets/icons/icon-tasklist-add-button';
import IconTaskListLeft from '#assets/icons/icon-tasklist-left';
import IconTaskListLeftFin from '#assets/icons/icon-tasklist-left-fin';

import { getCurrentTime } from 'utils/Time';
import {
  CONTAINER_HEIGHT,
  CONTAINER_WIDTH,
} from 'react-native-week-view/src/utils';

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
        <Text style={styles.taskTitle}>수행 리스트</Text>
        {network === 'offline' || targetId === 0 ? null : (
          <IconTaskListAdd
            name="icon-tasklist-add-button"
            size={19}
            color={'#229892'}
            onPress={() =>
              network === 'online' &&
              toDos.finishTime > getCurrentTime() &&
              toggleIsVisible()
            }
          />
        )}
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 300,
          }}
        >
          {taskList &&
            taskList.map((item, index) => {
              return (
                <View key={`T` + targetId + index}>
                  {index === 0 ? (
                    <IconTaskListLeft
                      name="icon-tasklist-left"
                      size={106}
                      color="#707070"
                      style={{
                        position: 'absolute',
                        left: SCREEN_HEIGHT > 668 ? -15 : -10,
                        top: 0,
                      }}
                    />
                  ) : (
                    <IconTaskListLeftFin
                      name="icon-tasklist-left-fin"
                      size={106}
                      color="#707070"
                      style={{
                        position: 'absolute',
                        left: SCREEN_HEIGHT > 668 ? -15 : -10,
                        top: 0,
                      }}
                    />
                  )}
                  <Task
                    index={index}
                    text={item}
                    targetId={targetId}
                    canPress={
                      targetId !== 0 &&
                      network === 'online' &&
                      toDos?.finishTime > getCurrentTime()
                    }
                  />
                </View>
              );
            })}

          {
            /*수행 리스트  없을때*/
            !taskList.length && (
              <View style={{ alignItems: 'center' }}>
                <IconTaskListLeft
                  name="icon-tasklist-left"
                  size={106}
                  color="#707070"
                  style={{
                    position: 'absolute',
                    left: SCREEN_HEIGHT > 668 ? -15 : -10,
                    top: 0,
                  }}
                />
                <TouchableOpacity
                  onPress={() =>
                    network === 'online' &&
                    toDos.finishTime > getCurrentTime() &&
                    toggleIsVisible()
                  }
                  style={styles.modatalTask}
                />
              </View>
            )
          }
        </ScrollView>
      </View>

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
  } else {
    return <Pagination taskList={[' ']} targetId={0} />;
  }
};

const styles = StyleSheet.create({
  paginationStyle: {
    position: 'absolute',
    top: SCREEN_HEIGHT > 668 ? CONTAINER_HEIGHT * 0.6 : CONTAINER_HEIGHT * 0.5,
    left: SCREEN_HEIGHT > 668 ? -50 : -70,
    width: 400,
    height: '100%',
  },
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
  taskTitle: {
    color: '#229892',
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 22,
    marginRight: 10,
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

  modatalTask: {
    backgroundColor: '#FFF',
    width: '75%',
    height: 80,
    borderRadius: 20,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 3.4,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    marginTop: 10,
    marginLeft: 20,
  },
});
