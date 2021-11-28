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

import { add } from 'redux/store';

import { Task } from 'components/items/TaskItem';
import { ModalLayout } from 'components/items/layout/ModalLayout';
import { SCREEN_HEIGHT, SCREEN_WIDTH, CONTAINER_WIDTH } from 'constant/const';

import IconTaskListAdd from '#assets/icons/icon-tasklist-add-button';
import IconTaskListLeft from '#assets/icons/icon-tasklist-left';
import IconTaskListLeftFin from '#assets/icons/icon-tasklist-left-fin';

import { getCurrentTime } from 'utils/timeUtil';
import { longTaskList, passedTodoAlert } from 'utils/buttonAlertUtil';
import { fontPercentage } from 'utils/responsiveUtil';

const IconTaskListLeftSize = 88;
const Pagination = ({ taskList, targetId }) => {
  const network = useSelector((state) => state.network);
  const toDos = useSelector((state) => state.toDos[targetId]);
  const [isVisible, setIsVisible] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const dispatch = useDispatch();
  const toggleIsVisible = () => {
    setIsVisible(!isVisible);
  };

  const addTaskList = (targetId, taskTitle) => {
    if (taskTitle === '') {
      toggleIsVisible();
      return;
    }
    if (taskTitle && taskTitle.length > 40) {
      longTaskList();
      return;
    }
    toggleIsVisible();
    if (taskTitle && taskTitle.length > 0)
      dispatch(add({ targetId, taskTitle }));
    setTaskTitle('');
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
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 12,
          }}
          onPress={() => {
            handlePaginationAddButton();
          }}
        >
          <Text style={styles.taskTitle}>체크리스트</Text>
          {network === 'offline' ? null : (
            <IconTaskListAdd
              name="icon-tasklist-add-button"
              size={16}
              color={'#229892'}
              style={{ marginTop: 2, marginRight: -2 }}
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
                      style={styles.taskListIcon}
                    />
                  ) : (
                    <IconTaskListLeftFin
                      name="icon-tasklist-left-fin"
                      size={IconTaskListLeftSize}
                      color="#707070"
                      style={styles.taskListIcon}
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
            /*체크 리스트  없을때*/
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
          onSubmitEditing={(event) => {
            addTaskList(targetId, event.nativeEvent.text);
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
    top: SCREEN_HEIGHT * 0.3,
    left: -SCREEN_WIDTH * 0.2,
    width: SCREEN_WIDTH,
    // maxWidth: 0,
    height: SCREEN_HEIGHT,
    paddingBottom: 150,
  },
  taskHeader: {
    paddingHorizontal: 35,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 15,
  },

  taskTitle: {
    color: '#229892',
    fontFamily: 'NotoSansKR-Bold',
    fontSize: fontPercentage(16.5),
    marginRight: 12,
  },
  taskText: {
    maxWidth: '100%',
    color: '#38504F',
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 20,
  },
  taskListIcon: {
    position: 'absolute',
    left: SCREEN_HEIGHT > 668 ? -13 : -10,
    top: 1,
  },
  /* TaskItem 의 task랑 같은 값. */
  modatalTask: {
    backgroundColor: '#FFF',
    width: '75%',
    maxWidth: 139.5 * 2,
    maxHeight: 74,
    height: CONTAINER_WIDTH * 0.198,
    borderRadius: 10,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 3.4,
      height: 5,
    },
    paddingLeft: 20,
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    fontSize: 15,
  },
});
