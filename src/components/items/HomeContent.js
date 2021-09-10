import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
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
  const [nowIndex, setNowIndex] = useState(todoArr.length);
  const getNowTimeIndex = () => {
    let tempData = Number.MAX_SAFE_INTEGER;
    let tempIndex = todoArr.length;
    todoArr
      .filter((item) => item.date === TODAY)
      .map((item, index) => {
        const nowH = getCurrentTime().replace(/:\d\d/, '');
        const nowM = getCurrentTime().replace(/\d\d:/, '');
        const startH = item.startTime.replace(/:\d\d/, '');
        const startM = item.startTime.replace(/\d\d:/, '');
        const finishH = item.finishTime.replace(/:\d\d/, '');
        const finishM = item.finishTime.replace(/\d\d:/, '');

        //현재시간이 시작 시간과 끝 시간 사이에 있다면 시작시간과 끝나는 시간 중 더 작은 차이값을 저장
        if (
          item.startTime < getCurrentTime() &&
          item.finishTime > getCurrentTime()
        ) {
          const 시작시간빼기지금시간 =
            Math.abs((startH - nowH) * 1) * 60 + Math.abs((startM - nowM) * 1);
          const 끝나는시간빼기지금시간 =
            Math.abs((finishH - nowH) * 1) * 60 +
            Math.abs((finishM - nowM) * 1);
          if (
            tempData > Math.min(시작시간빼기지금시간, 끝나는시간빼기지금시간)
          ) {
            tempData = Math.min(시작시간빼기지금시간, 끝나는시간빼기지금시간);
            tempIndex = index;
          }
        } else {
          //위의 경우가 아니라면 지금 시간에서 안 시작 한 일정들 중 차이값이 제일 작은거
          if (getCurrentTime() < item.finishTime) {
            if (
              item.finishTime > getCurrentTime() &&
              !item.isDone &&
              tempData >
                Math.abs((startH - nowH) * 1) * 60 +
                  Math.abs((startM - nowM) * 1)
            ) {
              tempData =
                Math.abs((startH - nowH) * 1) * 60 +
                Math.abs((startM - nowM) * 1);
              tempIndex = index;
            }
          }
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
        toDos: null,
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
      {isData ? (
        <></>
      ) : (
        <View
          style={{
            backgroundColor: '#000',
            flex: 1,
            width: Dimensions.get('screen').height > 667 ? 270 : 230,
            height:
              Dimensions.get('screen').height > 667
                ? Dimensions.get('screen').height * 0.285
                : Dimensions.get('screen').height * 0.334,
            position: 'absolute',
            top: 0,
            left: 10,
            opacity: 0.3,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 20 }}>
            현재일정이 없습니다
          </Text>
        </View>
      )}
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
