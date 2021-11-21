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
        height: 250,
        position: 'absolute',
        right: 0,
        top: 30,
        borderRadius: 10,
        padding: 15,
        borderWidth: 2,
        borderColor: '#54BCB6',
      }}
    >
      <Text
        style={{
          fontFamily: 'GodoB',
          color: '#229892',
          fontSize: 14,
          marginBottom: 15,
        }}
      >
        도움말
      </Text>
      <View style={{ display: 'flex', flexDirection: 'row', marginBottom: 15 }}>
        <IconHandleStart
          name="icon-handle-reset"
          color="#717171"
          size={17}
          style={{ marginRight: 15 }}
        />
        <Text style={[styles.noticeText, { marginBottom: 5 }]}>
          {`오늘 스케줄을 시작할 때 눌러주세요.`}
        </Text>
      </View>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <ImageBackground
          style={[{ width: 19, height: 19, marginRight: 15 }]}
          source={{ uri: 'iconHandleStart' }}
        />
        <Text style={styles.noticeText}>
          {`일정을 스킵할 때 눌러주세요.\n`}

          <View style={{ maxWidth: '90%' }}>
            <Text
              style={[
                styles.noticeText,
                styles.noticeDetailText,
                { lineHeight: 12 },
              ]}
            >
              {`일정 시간 내 목표 장소에 가지 않을 경우 해당 일정을 스킵해주세요! 버튼을 누르지 않으면 이후 일정들에서 사용자의 위치를 확인할 수 없습니다.\n`}
            </Text>
          </View>
        </Text>
      </View>
      {/* <Text style={styles.noticeText}> {`오늘을 꾹 눌러 보세요`}</Text> */}
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
  noticeDetailText: {
    fontSize: 10,
    color: '#BDBFBF',
    marginTop: 8,
  },
});
