import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import Swiper from 'react-native-swiper';
import deviceInfoModule from 'react-native-device-info';
import { dbService } from '../firebase';
import { connect } from 'react-redux';
import { init } from '../redux/store';

import IconTaskListAdd from '../assets/icons/icon-tasklist-add-button';
import IconTaskListLeft from '../assets/icons/icon-tasklist-left';
import IconTaskListLeftFin from '../assets/icons/icon-tasklist-left-fin';
import { ScrollView } from 'react-native-gesture-handler';

const uid = deviceInfoModule.getUniqueId();

const exampledata = {
  // 1628179352151: {
  //   date: '0806',
  //   finishtime: '12:00',
  //   id: 1628179352151,
  //   latitude: '위도',
  //   location: '스타벅스 어디점',
  //   longitude: '경도',
  //   starttime: '11:00',
  //   title: '자습',
  //   todos: ['자습하기 ', '단어 외우기 ', '커피마시기'],
  // },
  // 1628180195240: {
  //   date: '0806',
  //   finishtime: '16:00',
  //   id: 1628180195240,
  //   latitude: '위도',
  //   location: '장소명',
  //   longitude: '경도',
  //   starttime: '15:00',
  //   title: '운동',
  //   todos: [
  //     '자습하기 ',
  //     '단어 외우기 ',
  //     '커피마시기',
  //     '상체하기',
  //     '하체',
  //     '유산소',
  //   ],
  // },
  // 1628181968664: {
  //   date: '0806',
  //   finishtime: '15”00',
  //   id: 1628181968664,
  //   latitude: '위도',
  //   location: '장소명',
  //   longitude: '경도',
  //   starttime: '15:00',
  //   title: 'Title title',
  //   todos: ['Kustkust1', 'Listlist2'],
  // },
  // 1628185678507: {
  //   date: '0806',
  //   finishtime: '14:00',
  //   id: 1628185678507,
  //   latitude: '위도',
  //   location: '장소명',
  //   longitude: '경도',
  //   starttime: '12:00',
  //   title: 'Wasssap',
  //   todos: ['List1', 'List2'],
  // },
  // 1628185964498: {
  //   date: '0806',
  //   finishtime: '90',
  //   id: 1628185964498,
  //   latitude: '위도',
  //   location: '장소명',
  //   longitude: '경도',
  //   starttime: '7:00',
  //   title: 'Update',
  //   todos: ['List1', 'List2'],
  // },
  // 1628186073250: {
  //   date: '0806',
  //   finishtime: '22:00',
  //   id: 1628186073250,
  //   latitude: '위도',
  //   location: '장소명',
  //   longitude: '경도',
  //   starttime: '13:00',
  //   title: 'Hiiiiiii',
  //   todos: ['Hi hi', 'Hihihi 2'],
  // },
  // 1628186231641: {
  //   date: '0806',
  //   finishtime: '13:00',
  //   id: 1628186231641,
  //   latitude: '위도',
  //   location: '장소명',
  //   longitude: '경도',
  //   starttime: '12:00',
  //   title: 'Title',
  //   todos: ['Lililili'],
  // },
  // 1628187065020: {
  //   date: '0806',
  //   finishtime: '44:00',
  //   id: 1628187065020,
  //   latitude: '위도',
  //   location: '장소명',
  //   longitude: '경도',
  //   starttime: '44:00',
  //   title: 'Title121212',
  //   todos: ['List1', 'List2'],
  // },
  // 1628187328232: {
  //   date: '0806',
  //   finishtime: '17:00',
  //   id: 1628187328232,
  //   latitude: '위도',
  //   location: '장소명',
  //   longitude: '경도',
  //   starttime: '15:00',
  //   title: 'Eat',
  //   todos: ['Eat eat eat~~!'],
  // },
  // 1628187751973: {
  //   date: '0806',
  //   finishtime: '15:—',
  //   id: 1628187751973,
  //   latitude: '위도',
  //   location: '장소명',
  //   longitude: '경도',
  //   starttime: '14:00',
  //   title: 'Sleep',
  //   todos: ['Good'],
  // },
  // 1628187879369: {
  //   date: '0806',
  //   finishtime: '15:00',
  //   id: 1628187879369,
  //   latitude: '위도',
  //   location: '장소명',
  //   longitude: '경도',
  //   starttime: '12:00',
  //   title: 'Todo',
  //   todos: ['Todo list'],
  // },
  // 1628190932164: {
  //   date: '0806',
  //   finishtime: '16:00',
  //   id: 1628190932164,
  //   latitude: '위도',
  //   location: '장소명',
  //   longitude: '경도',
  //   starttime: '15:00',
  //   title: 'Todo wh',
  //   todos: [],
  // },
};

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
    flex: 2,
    height: 350,
    marginBottom: 30,
  },
  card: {
    flexShrink: 1,
    backgroundColor: '#54BCB6',
    width: 300,
    height: 220,
    padding: 20,
    marginHorizontal: 50,
    borderRadius: 10,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 3.4,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  cardTitle: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 35,
    marginRight: 15,
  },
  cardLocation: {
    fontFamily: 'NotoSansKR-Medium',
    fontWeight: '800',
    color: '#F4F4F4',
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
    flexShrink: 0,
  },
  taskContainer: {
    flexDirection: 'row',
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  task: {
    backgroundColor: '#FFF',
    width: '85%',
    borderRadius: 20,
    padding: 20,
    marginBottom: 10,
    paddingVertical: 25,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 3.4,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  taskText: {
    maxWidth: '80%',
    color: '#38504F',
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 20,
  },

  paginationStyle: {},
});
const Card = (props) => {
  const { index, text, todos, finishtime, starttime, location, id } = props;
  return (
    <View style={styles.card}>
      <IconTaskListAdd
        name="icon-tasklist-add-button"
        size={40}
        color="#707070"
      />
      <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
        <Text style={styles.cardTitle}>{text}</Text>
        <Text style={styles.cardLocation}>{location}</Text>
      </View>
      <Text style={styles.cardTime}>
        {starttime}
        {id ? `~` : ''}
        {finishtime}
      </Text>

      <Text>진행률바</Text>
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
  return (
    <View style={styles.taskContainer}>
      <IconTaskListLeft
        name="icon-tasklist-left"
        size={50}
        color="#707070"
        style={{ paddingHorizontal: 20 }}
      />
      <View style={styles.task}>
        <Text style={styles.taskText}>{props.text}</Text>
      </View>
    </View>
  );
};

const renderPagination = (index, total, context) => {
  //console.log(context.props.toDos);
  const list = context.props.toDos[index].todos;
  return (
    <>
      <View style={styles.taskHeader}>
        <Text
          style={{
            color: '#229892',
            fontFamily: 'NotoSansKR-Bold',
            fontSize: 20,
            marginBottom: 20,
          }}
        >
          수행 리스트
        </Text>
        <IconTaskListAdd
          name="icon-tasklist-add-button"
          size={20}
          color={'#229892'}
        />
      </View>
      <ScrollView
        style={{
          paddingHorizontal: 20,
          height: '100%',
          maxHeight: 900,
          flexGrow: 0,
        }}
      >
        {list &&
          list.map((item, index) => {
            return <Task key={index} text={item} />;
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
        style={{ height: '100%', maxHeight: 390 }}
      >
        {todoArr &&
          todoArr.map((item) => {
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
  let completed = false;
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
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeContent);
