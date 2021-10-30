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
        height: 170,
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

          <View>
            <Text
              style={[
                styles.noticeText,
                {
                  fontSize: 10,
                  color: '#BDBFBF',
                  marginTop: 15,
                },
              ]}
            >
              {`[스킵] 버튼을 눌러 해당 스케줄을 넘겨주세요! \n `}
            </Text>
            <Text
              style={[
                styles.noticeText,
                {
                  fontSize: 10,
                  color: '#BDBFBF',
                  marginTop: -8,
                },
              ]}
            >
              {`* 버튼을 누르지 않으면 해당 일정에서 \n 플래너가 계속 멈춰 있습니다. `}
            </Text>
          </View>
        </Text>
      </View>
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
