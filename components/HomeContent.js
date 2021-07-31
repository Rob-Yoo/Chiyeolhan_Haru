import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
const Cards = styled.View``;
const ToDos = styled.View``;
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
  return (
    <View style={styles.item}>
      <TouchableOpacity style={styles.square}></TouchableOpacity>
      <Text style={styles.itemText}>
        {props.starttime}~{props.finishtime}
      </Text>
      <Text style={styles.itemText}>위치:{props.location}</Text>

      <Text style={styles.itemText}>{props.text}</Text>
      <Text>진행률바</Text>
    </View>
  );
};
const Task = (props) => {
  return (
    <View style={styles.item}>
      <Text style={styles.itemText}>{props.text}</Text>
    </View>
  );
};

const renderPagination = (index, total, context) => {
  if (context.props.toDos.toDos[index] === undefined) {
    //데이터가 아직 없을때
    console.log('no data');
    return;
  } else {
    const list = context.props.toDos.toDos[index].todo;
    // console.log(context.props.toDos);
    return (
      <View style={styles.pagenationStyle}>
        <Text>수행 리스트</Text>
        <Text>{index ? index + 1 : ''}</Text>
        {list.map((item, index) => {
          return <Task key={index} text={item} />;
        })}
      </View>
    );
  }
};
function HomeContent(toDos) {
  const { toDos: content } = toDos;

  return (
    <>
      <Text>Cards</Text>
      <Cards style={{ flex: 2 }}>
        <Swiper toDos={toDos} renderPagination={renderPagination} loop={false}>
          {content.map((item, index) => {
            return (
              <Card
                key={index}
                index={index}
                text={item.title}
                starttime={item.starttime}
                finishtime={item.finishtime}
                location={item.location}
                toDos={toDos}
              />
            );
          })}
        </Swiper>
      </Cards>
    </>
  );
}
function mapStateToProps(state) {
  return { toDos: state };
}
export default connect(mapStateToProps)(HomeContent);
