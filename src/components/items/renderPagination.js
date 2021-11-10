import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { CONTAINER_HEIGHT } from 'react-native-week-view/src/utils';

import { add } from 'redux/store';

import { Task } from 'components/items/TaskItem';
import { ModalLayout } from 'components/items/layout/ModalLayout';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'constant/const';

import IconTaskListAdd from '#assets/icons/icon-tasklist-add-button';
import IconTaskListLeft from '#assets/icons/icon-tasklist-left';
import IconTaskListLeftFin from '#assets/icons/icon-tasklist-left-fin';

import { getCurrentTime } from 'utils/timeUtil';
import { longTaskList } from 'utils/buttonAlertUtil';
import { fontPercentage } from 'utils/responsiveUtil';
import { passedTodoAlert } from '../../utils/buttonAlertUtil';

const IconTaskListLeftSize = 90;
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
    if (taskTitle.length > 40) {
      longTaskList();
      return;
    }
    toggleIsVisible();
    if (taskTitle !== null && taskTitle.length > 0)
      dispatch(add({ targetId, taskTitle }));
    setTaskTitle(null);
  };

  const handlePaginationAddButton = () => {
    if (toDos.finishTime < getCurrentTime()) {
      passedTodoAlert();
    } else {
      network === 'online' &&
        toDos.finishTime > getCurrentTime() &&
        toggleIsVisible();
    }
  };
  return (
    <View style={styles.paginationStyle}>
      <View style={styles.taskHeader}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center' }}
          onPress={() => {
            handlePaginationAddButton();
          }}
        >
          <Text style={styles.taskTitle}>수행 리스트</Text>
          {network === 'offline' ? null : (
            <IconTaskListAdd
              name="icon-tasklist-add-button"
              size={15}
              color={'#229892'}
            />
          )}
        </TouchableOpacity>
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
                      size={IconTaskListLeftSize}
                      color="#707070"
                      style={{
                        position: 'absolute',
                        left: SCREEN_HEIGHT > 668 ? -13 : -10,
                        top: 2,
                      }}
                    />
                  ) : (
                    <IconTaskListLeftFin
                      name="icon-tasklist-left-fin"
                      size={IconTaskListLeftSize}
                      color="#707070"
                      style={{
                        position: 'absolute',
                        left: SCREEN_HEIGHT > 668 ? -13 : -10,
                        top: 2,
                      }}
                    />
                  )}
                  <Task
                    taskStyle={styles.modatalTask}
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
                  size={IconTaskListLeftSize}
                  color="#707070"
                  style={{
                    position: 'absolute',
                    left: SCREEN_HEIGHT > 668 ? -13 : -10,
                    top: 2,
                  }}
                />
                <TouchableOpacity
                  onPress={() =>
                    network === 'online' &&
                    toDos?.finishTime > getCurrentTime() &&
                    toggleIsVisible()
                  }
                  style={[
                    styles.modatalTask,
                    { marginTop: 10, marginLeft: 18 },
                  ]}
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
        <TextInput
          onChangeText={(text) => {
            setTaskTitle(text);
          }}
          onSubmitEditing={() => {
            addTaskList(targetId, taskTitle);
          }}
          style={styles.modatalTask}
          returnKeyType="done"
        />
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
    top: CONTAINER_HEIGHT * 0.49,
    left: -SCREEN_WIDTH * 0.19,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    paddingBottom: 150,
  },
  taskHeader: {
    paddingHorizontal: 39,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 15,
  },

  taskTitle: {
    color: '#229892',
    fontFamily: 'NotoSansKR-Bold',
    fontSize: fontPercentage(16.5),
    marginRight: 5,
  },
  taskText: {
    maxWidth: '100%',
    color: '#38504F',
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 20,
  },
  /* TaskItem 의 task랑 같은 값. */
  modatalTask: {
    backgroundColor: '#FFF',
    width: '75%',
    height: 74,
    borderRadius: 10,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 3.4,
      height: 5,
    },
    paddingLeft: 20,
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
});
