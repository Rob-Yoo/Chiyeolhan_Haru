import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  FlatList,
  LogBox,
} from 'react-native';
import Swiper from 'react-native-swiper';
import deviceInfoModule from 'react-native-device-info';
import { dbService } from 'utils/firebase';
import BackgroundGeolocation from 'react-native-background-geolocation';
import { connect } from 'react-redux';
import { init } from 'redux/store';

import IconTaskListAdd from '/assets/icons/icon-tasklist-add-button';
import IconTaskListLeft from '/assets/icons/icon-tasklist-left';
import IconTaskListLeftFin from '/assets/icons/icon-tasklist-left-fin';
import IconTaskToDoman from '/assets/icons/icon-todo-man';
import { ScrollView } from 'react-native-gesture-handler';

import { UID } from 'constant/const';

const NoData = styled.View`
  position: absolute;
  left: -100;
  width: 600;
  height: 600;
  background-color: #000;
  opacity: 0.2;
`;
const styles = StyleSheet.create({
  homeContainer: {
    flex: 3,
    alignItems: 'center',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#54BCB6',
    width: '90%',
    maxHeight: 220,
    padding: 30,
    marginHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 3.4,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  todomanBackgroundCircle: {
    position: 'absolute',
    top: 25,
    left: 25,
    width: 60,
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 50,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.34,
    shadowRadius: 5.84,
  },
  cardText: {
    position: 'relative',
  },
  cardTitle: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 35,
    marginRight: 15,
    position: 'relative',
  },
  cardLocation: {
    fontFamily: 'NotoSansKR-Medium',
    fontWeight: '800',
    color: '#F4F4F4',
    marginBottom: 5,
  },
  cardTime: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 15,
  },
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
  progressBar: {
    width: '100%',
    height: 10,
    backgroundColor: '#FFFFFF',
  },

  paginationStyle: {},
});
const Card = (props) => {
  const { text, finishtime, starttime, location, id } = props;
  return (
    <View style={styles.card}>
      <View style={styles.todomanBackgroundCircle} />
      <IconTaskToDoman
        name="icon-todo-man"
        size={50}
        color="#229892"
      ></IconTaskToDoman>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          flexShrink: 1,
          maxHeight: 300,
        }}
      >
        <Text style={styles.cardTitle}>{text}</Text>
        <View
          style={{
            flexWrap: 'nowrap',
          }}
        >
          <View
            style={{
              position: 'absolute',
              left: -10,
              width: 5,
              height: 20,
              backgroundColor: '#00A29A',
            }}
          ></View>
          <Text style={styles.cardLocation}>{location}</Text>
        </View>
      </View>
      <Text style={styles.cardTime}>
        {starttime}
        {id ? `` : '~'}
        {finishtime}
      </Text>

      <View style={styles.progressBar}></View>
      {id ? (
        <NoData
          style={{
            position: 'absolute',
            left: -100,
            width: 600,
            height: 600,
            backgroundColor: '#000',
            opacity: 0.2,
          }}
        >
          <Text
            style={{
              position: 'absolute',
              top: 50,
              right: '45%',
              top: '15%',
              color: '#FFFFFF',
              opacity: 1,
              fontFamily: 'NotoSansKR-Regular',
              fontSize: 20,
            }}
          >
            현재 일정이 없습니다
          </Text>
        </NoData>
      ) : null}
    </View>
  );
};
const Task = (props) => {
  const { text: taskText } = props;
  return (
    <>
      <View style={styles.taskContainer}>
        <View style={styles.task}>
          <Text style={styles.taskText}>
            {taskText.length > 17 ? `${taskText.substr(0, 16)}...` : taskText}
          </Text>
        </View>
      </View>
    </>
  );
};

const renderPagination = (index, total, context) => {
  const list = context.props.toDos[index].todos;
  const targetId = context.props.toDos[index].id;
  //리스트에 추가할때
  const addTaskList = async () => {
    await dbService
      .collection(`${UID}`)
      .doc(`${targetId}`)
      .update({
        todos: [...taskList],
      });
  };
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
                <Task key={index} text={item} />
              </View>
            );
          })}
      </ScrollView>
    </>
  );
};

const PaintHome = (todoArr) => {
  if (Array.isArray(todoArr) && todoArr.length === 0) {
    todoArr = [
      {
        date: '',
        finishtime: '',
        id: 0,
        latitude: '',
        location: '',
        address: '',
        longitude: '',
        starttime: '',
        title: '',
        todos: [' '],
      },
    ];
  }
  return (
    <View style={styles.homeContainer}>
      <Swiper
        toDos={todoArr}
        renderPagination={renderPagination}
        loop={false}
        style={{ height: '100%', maxHeight: 450 }}
      >
        {todoArr &&
          todoArr.map((item) => {
            //console.log(item);
            return (
              <Card
                key={item.id}
                text={item.title}
                starttime={item.starttime}
                finishtime={item.finishtime}
                location={item.location}
                toDos={todoArr}
              />
            );
          })}
      </Swiper>
    </View>
  );
};

function HomeContent({ initToDo, toDos }) {
  //  console.log(`store toDos : ${JSON.stringify(toDos)}`);
  const [isLoading, setLoading] = useState(true);
  const [fetchedToDo, setFetchObj] = useState({});
  const mounted = useRef(false);
  const mounted2 = useRef(false);
  let todoArr = [];
  let rowObj = {};
  //Object.keys(fetchedToDo).length === 0

  const getToDos = async () => {
    //db연결
    const row = await dbService.collection(`${uid}`).get();
    row.forEach((data) => (rowObj[data.id] = data.data()));
    if (Object.keys(rowObj).length === 0) {
      setLoading(false);
    }
    setFetchObj(rowObj);
  };

  useEffect(() => {
    BackgroundGeolocation.onGeofence((event) => {
      console.log('Tracking Start');
      console.log(event.action);
    });
    getToDos();
  }, []);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      initToDo(fetchedToDo);
    }
  }, [fetchedToDo]);

  useEffect(() => {
    if (!mounted2.current) {
      mounted2.current = true;
    } else {
      setLoading(false);
    }
  }, [toDos]);
  for (key in toDos) todoArr.push(toDos[key]);

  return <>{isLoading ? <Text>loading</Text> : PaintHome(todoArr)}</>;
}
function mapStateToProps(state) {
  return { toDos: state };
}

function mapDispatchToProps(dispatch) {
  return {
    initToDo: (todo) => dispatch(init(todo)),
    addToDo: (task, id) => dispatch(add({ task, id })),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeContent);
