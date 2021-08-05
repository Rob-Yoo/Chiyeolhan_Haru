import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import deviceInfoModule from 'react-native-device-info';
const uid = deviceInfoModule.getUniqueId();
import { dbService } from '../firebase';
import { connect } from 'react-redux';

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

function HomeContent(initToDo) {
  //const { toDos: content } = toDos;
  const [isLoading, setLoading] = useState(true);
  const [fetchedToDo, setFetchObj] = useState({});
  const [todoArr, setToDoArr] = useState([]);
  let rowObj = {};
  //Object.keys(fetchedToDo).length === 0

  const getToDos = async () => {
    const row = await dbService.collection(`${uid}`).get();
    row.forEach((data) => (rowObj[data.id] = data.data()));
    setFetchObj(rowObj);
    let tempArr = [];
    for (key in rowObj) tempArr.push(rowObj[key]);
    setToDoArr([...tempArr]);
    setLoading(false);
  };

  useEffect(() => {
    getToDos();
    return console.log('unmounted');
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
function mapStateToProps(state) {
  return { toDos: state };
}

function mapDispatchToProps(dispatch) {
  return {
    initToDo: (todo) => dispatch(init(todo)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeContent);
