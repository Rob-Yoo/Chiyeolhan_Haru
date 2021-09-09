import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { init } from 'redux/store';
import { connect } from 'react-redux';
import Swiper from 'react-native-swiper';
import { dbService } from 'utils/firebase';
import { UID, TODAY } from 'constant/const';
import { Card } from 'components/items/CardItem';
import { getCurrentTime } from 'utils/Time';
import { renderPagination } from 'components/items/renderPagination';

const styles = StyleSheet.create({
  homeContainer: {
    flex: 5,
    alignItems: 'center',
  },
  swiperStyle: { height: '100%' },
});

const PaintHome = ({ todoArr }) => {
  const [isData, setIsData] = useState(
    todoArr[0]?.id === undefined ? false : true,
  );
  const [nowIndex, setNowIndex] = useState(0);
  const getNowTimeIndex = () => {
    let tempData = 999999;
    let tempIndex = 0;
    todoArr
      .filter((item) => item.date === TODAY)
      .map((item, index) => {
        const nowH = getCurrentTime().replace(/:\d\d/, '');
        const startH = item.startTime.replace(/:\d\d/, '');
        const nowM = getCurrentTime().replace(/\d\d:/, '');
        const startM = item.startTime.replace(/\d\d:/, '');
        if (
          item.finishTime > getCurrentTime() &&
          !item.isDone &&
          tempData >
            Math.abs((startH - nowH) * 1) * 60 + Math.abs((startM - nowM) * 1)
        ) {
          tempData =
            Math.abs((startH - nowH) * 1) * 60 + Math.abs((startM - nowM) * 1);
          tempIndex = index;
        }
      });

    setNowIndex(tempIndex);
  };
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
    getNowTimeIndex();
  }, []);
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
        index={nowIndex}
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
const mapStateToProps = (state) => {
  return { toDos: state };
};

const mapDispatchToProps = (dispatch) => {
  return {
    initToDo: (todo) => dispatch(init(todo)),
    addToDo: (task, id) => dispatch(add({ task, id })),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(HomeContent);
