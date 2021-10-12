import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';

import { Nodata } from 'components/items//Nodata';
import { Card } from 'components/items/CardItem';
import { renderPagination } from 'components/items/renderPagination';

import { getCurrentTime, getDate } from 'utils/Time';

import { SCREEN_HEIGHT } from 'constant/const';

const HomeContent = (props) => {
  let todoArr = props.todoArr;
  if (todoArr.length === 0) return <Nodata />;

  const [nowIndex, setNowIndex] = useState(
    todoArr[1].title === ' ' ? 0 : todoArr.length,
  );
  const { TODAY } = getDate();

  useEffect(() => {
    todoArr[1].title !== ' ' && getNowTimeIndex();
  }, []);

  const getNowTimeIndex = () => {
    let tempData = Number.MAX_SAFE_INTEGER;
    let tempIndex = todoArr.length;
    todoArr
      .filter((item) => item.date === TODAY && item.title !== ' ')
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
          //시작시간빼기지금시간
          const startTimeDiff =
            Math.abs((startH - nowH) * 1) * 60 + Math.abs((startM - nowM) * 1);
          //끝나는시간빼기지금시간
          const finishTimeDiff =
            Math.abs((finishH - nowH) * 1) * 60 +
            Math.abs((finishM - nowM) * 1);
          if (tempData > Math.min(startTimeDiff, finishTimeDiff)) {
            tempData = Math.min(startTimeDiff, finishTimeDiff);
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
    console.log(tempIndex);
  };

  return (
    <View style={styles.homeContainer}>
      <Swiper
        toDos={todoArr}
        renderPagination={renderPagination}
        loop={false}
        style={styles.swiperStyle}
        index={nowIndex}
        scrollViewStyle={{ overflow: 'visible' }}
        containerStyle={{
          width: SCREEN_HEIGHT > 668 ? 280 : 260,
        }}
        scrollEnabled={todoArr[1].title === ' ' ? false : true}
      >
        {todoArr &&
          todoArr.map((item, index) => {
            if (item.title === ' ')
              return (
                <View
                  key={index}
                  style={{
                    flex: 0.9,
                    maxHeight:
                      SCREEN_HEIGHT > 668
                        ? SCREEN_HEIGHT / 3.5
                        : SCREEN_HEIGHT / 3,
                    backgroundColor: '#4daaa4',
                    borderRadius: 20,
                    shadowColor: '#00000029',
                    shadowOffset: {
                      width: 0,
                      height: 15,
                    },
                    shadowOpacity: 1.5,
                    shadowRadius: 6.84,
                  }}
                ></View>
              );
            else {
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
                />
              );
            }
          })}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  /*Home*/
  homeContainer: {
    flex: 5,
    alignItems: 'center',
  },
  swiperStyle: { height: '100%' },
});

export default HomeContent;
