import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import IconTaskListAdd from '#assets/icons/icon-tasklist-add-button';
import IconTaskListLeft from '#assets/icons/icon-tasklist-left';
import IconTaskListLeftFin from '#assets/icons/icon-tasklist-left-fin';
import { useDispatch } from 'react-redux';
import { add } from 'redux/store';
import { Task } from 'components/items/TaskItem';
import { ModalLayout } from 'components/items/layout/ModalLayout';

const styles = StyleSheet.create({
  taskHeader: {
    top: 0,
    paddingHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    flexShrink: 0,
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
});

export const Pagination = ({ taskList, targetId }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const dispatch = useDispatch();

  const toggleIsVisible = () => {
    setIsVisible(!isVisible);
  };

  const addTaskList = () => {
    toggleIsVisible();
    dispatch(add({ targetId, taskTitle }));
  };

  return (
    <>
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
        <IconTaskListAdd
          name="icon-tasklist-add-button"
          size={19}
          color={'#229892'}
          onPress={() => toggleIsVisible()}
        />
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
                <Task index={index} text={item} targetId={targetId} />
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
    </>
  );
};

export const renderPagination = (index, total, context) => {
  const taskList = context.props.toDos[index].toDos;
  const targetId = context.props.toDos[index].id;
  return <Pagination taskList={taskList} targetId={targetId} />;
};
