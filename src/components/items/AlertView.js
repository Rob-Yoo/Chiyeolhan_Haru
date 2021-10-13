import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import { CONTAINER_WIDTH } from 'react-native-week-view/src/utils';
import IconHandleStart from '#assets/icons/icon-handle-start';

const NO_WIDTH_SPACE = '​';
export const AlertView = () => {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        width: CONTAINER_WIDTH,
        height: 360,
        position: 'absolute',
        right: 0,
        top: 30,
        borderRadius: 10,
        padding: 15,
        borderWidth: 0.5,
      }}
    >
      <Text
        style={{
          fontFamily: 'GodoB',
          color: '#229892',
          fontSize: 20,
          marginBottom: 10,
        }}
      >
        도움말
      </Text>
      <Text style={[styles.noticeText, { marginBottom: 5 }]}>
        <IconHandleStart name="icon-handle-reset" size={17} />
        {` - 시작 버튼 
위치 서비스를 시작하는 버튼입니다. 위치 서비스를 일찍 시작하면 앱을 종료해도 백그라운드에서 동작하기 때문에 배터리가 소모될 수 있습니다.`}

        <Text style={[styles.noticeText, styles.hilighted]}>
          {` 따라서, 오늘 첫 일정의 시작 시간 직전에 누르는 것이 좋습니다.`}
        </Text>
      </Text>
      <Text style={styles.noticeText}>
        <ImageBackground
          style={[{ width: 19, height: 19 }]}
          source={{ uri: 'iconHandleStart' }}
        />
        {` - 스킵 버튼\n`}

        <Text
          style={[styles.noticeText, styles.hilighted]}
        >{`배터리 소모를 최소화`}</Text>

        {`하기 위해 하나의 일정에만 위치 서비스를 제공해서 해당 목표 장소에 도착하면 다음 목표 장소로 위치 서비스를 넘깁니다. 따라서 만약 목표 장소에 `}
        <Text
          style={[styles.noticeText, styles.hilighted]}
        >{`안 올 경우에`}</Text>
        {`는 이 버튼을 눌러야 다음 목표 장소에 위치 서비스를 제공할 수 있습니다. 이 버튼은 현재 일정의 `}
        <Text>시작 시간 이후부터 동작</Text>
        {`합니다.`}
      </Text>
      <Text style={styles.noticeText}>
        {`\n * 위치 서비스는 사용자의 위치를 계속 추적 
    하지 않고 목표 장소의`}
        <Text style={[styles.noticeText, styles.hilighted]}>200m 반경 </Text>
        {`안에 사
    용자가 들어왔는지 나갔는지만 판단합니다.`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  hilighted: {
    backgroundColor: '#2DACA540',
    //color: '#FECC02',
  },
  noticeText: {
    fontFamily: 'GodoB',
    color: '#788382',
    fontSize: 13,
  },
});
