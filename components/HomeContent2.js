import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
//import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';

import deviceInfoModule from 'react-native-device-info';
const uid = deviceInfoModule.getUniqueId();

import { dbService } from '../firebase';
import { render } from 'react-dom';
const data = [
  // {
  //   date: '0805',
  //   finishtime: '15:00',
  //   id: 1628105226681,
  //   latitude: '위도',
  //   longitude: '경도',
  //   starttime: '14:00',
  //   location: '위치1',
  //   title: 'titl1',
  //   todos: ['title1 할일', 'title1 밥먹기'],
  // },
  // {
  //   date: '0805',
  //   finishtime: '14:00',
  //   id: 1628145718977,
  //   latitude: '위도',
  //   longitude: '경도',
  //   starttime: '12:00',
  //   title: 'Title2',
  //   location: '위치1',
  //   todos: ['Lis1'],
  // },
  // {
  //   date: '0805',
  //   finishtime: '14:00',
  //   id: 1628151033800,
  //   latitude: '위도',
  //   longitude: '경도',
  //   starttime: '13:00',
  //   title: 'Title3',
  //   location: '위치1',
  //   todos: ['List', 'List2'],
  // },
  // {
  //   date: '0805',
  //   finishtime: '14:00',
  //   id: 1628153783609,
  //   latitude: '위도',
  //   longitude: '경도',
  //   starttime: '13:00',
  //   title: 'title4',
  //   location: '위치1',
  //   todos: ['밥먹기', '씻기'],
  // },
];
const Cards = styled.View``;
const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  square: {
    width: 24,
    height: 24,
    backgroundColor: '#55bcf6',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: '80%',
  },
  circular: {
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: '#55BCF6',
    borderRadius: 5,
  },
  paginationStyle: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});
const Card = (props) => {
  const { index, text, todos, finishtime, starttime, location } = props;
  //console.log(`props:${JSON.stringify(props)}`);
  //console.log(finishtime);
  return (
    <View style={styles.item}>
      <TouchableOpacity style={styles.square}></TouchableOpacity>
      <Text style={styles.itemText}>
        {starttime}~{finishtime}
      </Text>
      <Text style={styles.itemText}>위치:{location}</Text>

      <Text style={styles.itemText}>{text}</Text>
      <Text>진행률바</Text>
    </View>
  );
};
const Task = (props) => {
  //console.log(props);
  return (
    <View style={styles.item}>
      <Text style={styles.itemText}>{props.text}</Text>
    </View>
  );
};

const renderPagination = (index, total, context) => {
  //console.log(context.props.toDos[index].todos);
  if (context.props.toDos.length === 0) {
    //데이터가 아직 없을때
    console.log('no data');
    return;
  } else {
    console.log(context.props.toDos);
    const list = context.props.toDos[index].todos;
    return (
      <View style={styles.pagenationStyle}>
        <Text>수행 리스트</Text>
        {list.map((item, index) => {
          return <Task key={index} text={item} />;
        })}
      </View>
    );
  }

  return (
    <View style={styles.pagenationStyle}>
      <Text>수행 리스트</Text>
      <Text>{index}</Text>
    </View>
  );
};

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`${ms} 밀리초가 지났습니다.`);
      resolve();
    }, ms);
  });
}

function HomeContent(initToDo) {
  //const { toDos: content } = toDos;
  const [isLoading, setLoading] = useState(true);
  const [fetchedToDo, setFetchObj] = useState({});
  const [todoArr, setToDoArr] = useState([]);
  let rowObj = {};
  //Object.keys(fetchedToDo).length === 0
  //getToDo로 데이터 받아오기 loading중 바꿔주기
  const getToDos = async () => {
    const row = await dbService.collection(`${uid}`).get();
    row.forEach((data) => (rowObj[data.id] = data.data()));
    setFetchObj(rowObj);

    await delay(1000);
    const result = await Promise.resolve('끝');
    console.log(result);

    //todoArr 업데이트 해주기
    let tempArr = [];
    for (key in rowObj) tempArr.push(rowObj[key]);
    setToDoArr([...tempArr]);
    //setToDoArr([...data]);
    setLoading(false);
  };

  useEffect(() => {
    getToDos();
  }, []);

  useEffect(() => {
    console.log(todoArr);
  }, [todoArr]);

  return (
    <>
      <Text>Cards</Text>
      {isLoading ? (
        <Text>loading</Text>
      ) : (
        <Cards style={{ flex: 2 }}>
          <Swiper
            toDos={todoArr}
            renderPagination={renderPagination}
            loop={false}
          >
            {todoArr.map((item) => {
              // console.log(`imtem: ${JSON.stringify(item)}`);
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
        </Cards>
      )}
    </>
  );
}
// function mapStateToProps(state) {
//   return { toDos: state };
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     initToDo: (todo) => dispatch(init(todo)),
//   };
// }
// export default connect(mapStateToProps, mapDispatchToProps)(HomeContent);
export default HomeContent;
