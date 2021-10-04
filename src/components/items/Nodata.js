import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../constant/const';
import IconTaskToDoman from '#assets/icons/icon-todo-man';
import { useNavigation } from '@react-navigation/native';
export const Nodata = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 5, alignItems: 'center' }}>
      <View
        style={{
          position: 'absolute',
          top: -200,
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT + 200,
          opacity: 0.3,
          backgroundColor: '#000000',
        }}
      ></View>
      <View
        style={{
          position: 'absolute',
          width: '80%',
          height: '60%',
          justifyContent: 'space-around',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          paddingVertical: 20,
        }}
      >
        <View
          style={{
            width: 200,
            height: 200,
            backgroundColor: '#54BCB6',
            borderRadius: 20,
            marginBottom: 30,
            alignItems: 'center',
            justifyContent: 'space-around',
            paddingTop: 40,
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              width: SCREEN_HEIGHT > 668 ? 40 : 20,
              height: SCREEN_HEIGHT > 668 ? 40 : 20,
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              left: 10,
              top: 10,
            }}
          >
            <IconTaskToDoman name="icon-todo-man" size={30} color="#229892" />
          </View>
          <Text
            style={{
              fontFamily: 'NotoSansKR-Bold',
              color: '#fff',
              fontSize: 20,
            }}
          >
            치열한 하루!
          </Text>
          <View
            style={{
              width: '80%',
              height: 4,
              backgroundColor: '#fff',
              borderRadius: 10,
            }}
          />
        </View>

        <Text
          style={{
            color: '#229892',
            fontFamily: 'NotoSansKR-Bold',
            fontSize: 20,
          }}
        >
          일정을 추가해보세요
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('ScheduleToday')}>
          <Text>버튼</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
