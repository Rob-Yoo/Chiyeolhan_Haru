import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import IconGobackButton from '#assets/icons/icon-go-back-button';

//임시데이터
import { data } from '../constant/data';

import { saveSearchedData } from '../utils/asyncStorage';

const styles = StyleSheet.create({
  searchedHistoryContainer: {
    flex: 1,
    width: '100%',
    height: 900,
    backgroundColor: '#fff',
  },
  icon: { marginRight: 10 },
  searchedText: {},
});

export const MapSearch = ({
  _handlePlacesAPI,
  modalHandler,
  setSearchedObject,
}) => {
  const [inputText, setText] = useState('');
  const [historyObj, setHistoryObj] = useState([]);
  const [searchedHistoryVisible, setSearchedHistroyVisible] = useState(false);

  //async 에서 데이터 받아오기
  //data에 어싱크에서 받아온 데이터가 들어가면 됨
  useEffect(() => {
    setHistoryObj([...data]);
  }, []);

  const deleteHistory = (id) => {
    setHistoryObj(historyObj.filter((item) => item.id !== id));
  };
  const printSearchHistory = Object.keys(historyObj).map((key) => {
    const item = historyObj[key];
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: 15,
          paddingHorizontal: 10,
          borderBottomWidth: 1,
        }}
        key={item.id}
      >
        <Text style={styles.icon}>
          {item.type === 'location' ? '장소' : '돋보기'}
        </Text>
        <Text style={styles.searchedText}>{item.text}</Text>
        <Text
          id={item.id}
          style={{ position: 'absolute', top: 15, right: 0 }}
          onPress={() => deleteHistory(item.id)}
        >
          삭제
        </Text>
      </View>
    );
  });

  return (
    <View>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }}
      >
        <View
          style={{
            flex: 1,
            width: '100%',
            height: searchedHistoryVisible ? 900 : 0,
            backgroundColor: '#fff',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              height: 130,
              backgroundColor: '#54BCB6',
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              paddingTop: 50,
            }}
          >
            <IconGobackButton
              name="icon-go-back-button"
              size={20}
              style={{ width: 30, height: 30, marginLeft: 15 }}
              onPress={modalHandler}
            />
            <TextInput
              style={{
                backgroundColor: '#fff',
                width: 340,
                height: 50,
                borderRadius: 10,
              }}
              onTouchStart={() => setSearchedHistroyVisible(true)}
              placeholder=" 장소, 버스, 지하철, 주소 검색"
              onChangeText={(text) => setText(text)}
              onSubmitEditing={() => {
                _handlePlacesAPI(inputText);
                setSearchedHistroyVisible(!searchedHistoryVisible);

                //async에 'type:search'로 넣기
                setSearchedObject({
                  id: Date.now(),
                  text: inputText,
                  type: 'search',
                });
              }}
            />
          </View>
          {searchedHistoryVisible ? (
            <ScrollView style={{ paddingHorizontal: 20 }}>
              {printSearchHistory}
              <Text
                onPress={() => setHistoryObj([])}
                style={{
                  fontSize: 20,
                  marginVertical: 25,
                  textAlign: 'center',
                }}
              >
                전체삭제
              </Text>
            </ScrollView>
          ) : (
            <></>
          )}
        </View>
      </View>
    </View>
  );
};
