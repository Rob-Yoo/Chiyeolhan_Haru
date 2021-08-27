import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import { dbService } from 'utils/firebase';
import { connect } from 'react-redux';
import { init } from 'redux/store';

import { UID, TODAY } from 'constant/const';
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

const PaintHome = ({ todoArr }) => {
  const [isData, setIsData] = useState(
    todoArr[0]?.id === undefined ? false : true,
  );

  if (Array.isArray(todoArr) && todoArr.length === 0) {
    todoArr = [
      {
        date: '',
        finishTime: '',
        id: 0,
        latitude: '',
        location: '',
        address: '',
        longitude: '',
        startTime: '',
        title: '',
        toDos: [' '],
      },
    ];
  }
  useEffect(() => {
    setIsData(todoArr[0]?.id === 0 ? false : true);
  }, [todoArr]);
  return (
    <View style={styles.homeContainer}>
      <Swiper
        toDos={todoArr}
        renderPagination={renderPagination}
        loop={false}
        style={styles.swiperStyle}
      >
        {todoArr &&
          todoArr.map((item, index) => {
            return (
              <Card
                key={`C` + index}
                text={item.title}
                startTime={item.startTime}
                finishTime={item.finishTime}
                location={item.location}
                toDos={todoArr}
                id={item.id}
                isDone={item.isDone}
                isData={isData}
              />
            );
          })}
      </Swiper>
    </View>
  );
};

const HomeContent = ({ initToDo, toDos }) => {
  const [isLoading, setLoading] = useState(true);
  const [fetchedToDo, setFetchObj] = useState({});
  const mounted = useRef(false);
  const mounted2 = useRef(false);
  let todoArr = [];
  let rowObj = {};

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
      const row = await dbService
        .collection(`${UID}`)
        // .where('date', '==', `${TODAY}`)
        .get();
      row.forEach((data) => (rowObj[data.id] = data.data()));
      if (Object.keys(rowObj).length === 0) {
        setLoading(false);
      }
      setFetchObj(rowObj);
    } catch (e) {
      console.log('getToDos Error :', e);
    }
  };

  for (key in toDos) {
    if (toDos[key].date === TODAY) todoArr.push(toDos[key]);
  }
  todoArr.sort((a, b) => {
    if (a.id < b.id) {
      return -1;
    }
    if (a.id > b.id) {
      return 1;
    }
    return 0;
  });

  return (
    <>{isLoading ? <Text>loading</Text> : <PaintHome todoArr={todoArr} />}</>
  );
};
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
