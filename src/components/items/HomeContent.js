import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import { TODAY } from 'constant/const';
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

const HomeContent = (props) => {
  let todoArr = props.todoArr;
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
        scrollViewStyle={{ overflow: 'visible' }}
        removeClippedSubviews={false}
        containerStyle={{ width: 300 }}
        //paginationStyle={{ width: 400 }}
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
            width: '110%',
            height:
              Dimensions.get('screen').height > 667
                ? Dimensions.get('screen').height * 0.285
                : Dimensions.get('screen').height * 0.334,
            position: 'absolute',
            top: -7,
            opacity: 0.3,
            justifyContent: 'center',
            alignItems: 'center',
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

export default HomeContent;
