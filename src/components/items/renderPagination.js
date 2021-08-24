import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import IconTaskListAdd from '#assets/icons/icon-tasklist-add-button';
import IconTaskListLeft from '#assets/icons/icon-tasklist-left';
import IconTaskListLeftFin from '#assets/icons/icon-tasklist-left-fin';
import { ScrollView } from 'react-native-gesture-handler';
import { Task } from 'components/items/TaskItem';
import { useDispatch } from 'react-redux';
import { add } from 'redux/store';

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
});

export const Pagination = ({ list, targetId }) => {
  const dispatch = useDispatch();

  return (
    <>
      <View style={styles.taskHeader}>
        <Text
          style={{
            color: '#229892',
            fontFamily: 'NotoSansKR-Bold',
            fontSize: 20,
            marginBottom: 5,
          }}
        >
          수행 리스트
        </Text>
        <IconTaskListAdd
          name="icon-tasklist-add-button"
          size={20}
          color={'#229892'}
          onPress={() => console.log('press')}
        />
      </View>
      <ScrollView
        style={{
          paddingHorizontal: 20,
          height: '100%',
          maxHeight: 700,
          flexGrow: 0,
        }}
      >
        {list &&
          list.map((item, index) => {
            return (
              <View key={index}>
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
                  key={targetId}
                  index={index}
                  text={item}
                  targetId={targetId}
                />
              </View>
            );
          })}
      </ScrollView>
    </>
  );
};

export const renderPagination = (index, total, context) => {
  const list = context.props.toDos[index].toDos;
  const targetId = context.props.toDos[index].id;
  return <Pagination list={list} targetId={targetId} />;
};
