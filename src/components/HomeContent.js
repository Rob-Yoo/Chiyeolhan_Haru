import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import { dbService } from 'utils/firebase';
import { connect } from 'react-redux';
import { init } from 'redux/store';

import { UID } from 'constant/const';
import { Card } from 'components/items/CardItem';
import { renderPagination } from 'components/items/renderPagination';

const styles = StyleSheet.create({
  homeContainer: {
    flex: 3,
    alignItems: 'center',
    marginBottom: 20,
  },
  swiperStyle: { height: '100%', maxHeight: 450 },
});

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
        style={styles.swiperStyle}
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

  const getToDos = async () => {
    try {
      const row = await dbService.collection(`${UID}`).get();
      row.forEach((data) => (rowObj[data.id] = data.data()));
      if (Object.keys(rowObj).length === 0) {
        setLoading(false);
      }
      setFetchObj(rowObj);
    } catch (e) {
      console.log('getToDos Error :', e);
    }
  };

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
