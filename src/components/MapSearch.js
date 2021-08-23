import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { deleteSearchedData } from 'utils/AsyncStorage';
import { deleteAllSearchedData } from 'utils/AsyncStorage';

import IconGobackButton from '#assets/icons/icon-go-back-button';
import IconSearchedSearch from '#assets/icons/icon-searched-search';
import IconSearchedLocation from '#assets/icons/icon-searched-location';

const styles = StyleSheet.create({
  mapSearchContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  },
  searchedHistoryContainer: {
    flex: 1,
    width: '100%',
    height: 900,
    backgroundColor: '#fff',
  },
  icon: { marginRight: 10 },
  searchedText: {
    fontSize: 20,
    fontWeight: '500',
  },
  searchedDeleteText: {
    borderColor: '#A2A2A2',
    color: '#A2A2A2',
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 16,
    position: 'absolute',
    padding: 3,
    top: 20,
    right: 10,
  },
  searchInputView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 140,
    backgroundColor: '#54BCB6',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingTop: 20,
  },
  mapSearchInput: {
    backgroundColor: '#fff',
    width: 340,
    height: 50,
    borderRadius: 10,
  },
  searchedDeleteAllText: {
    fontSize: 20,
    marginVertical: 25,
    textAlign: 'center',
  },
  searcehdItem: {
    flexDirection: 'row',
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#707070',
  },
});

export const MapSearch = ({
  _handlePlacesAPI,
  modalHandler,
  searchedList,
  setSearchedList,
}) => {
  const [inputText, setText] = useState('');
  const [searchedHistoryVisible, setSearchedHistroyVisible] = useState(false);

  const deleteAllHistory = async () => {
    try {
      await deleteAllSearchedData();
      setSearchedList([]);
    } catch (e) {
      console.log('deleteAllHistory Error :', e);
    }
  };
  const deleteHistory = async (id) => {
    try {
      const tempData = searchedList.filter((item) => item.id !== id);
      await deleteSearchedData(tempData);
      setSearchedList(tempData);
    } catch (e) {
      console.log('deleteHistory Error :', e);
    }
  };
  const searchInput = useRef('');

  return (
    <View>
      <View style={styles.mapSearchContainer}>
        <View
          style={{
            flex: 1,
            width: '100%',
            height: searchedHistoryVisible ? 900 : 0,
            backgroundColor: '#fff',
          }}
        >
          <View style={styles.searchInputView}>
            <IconGobackButton
              name="icon-go-back-button"
              size={20}
              style={{ width: 30, height: 30, marginLeft: 15 }}
              onPress={modalHandler}
            />
            <TextInput
              style={styles.mapSearchInput}
              ref={searchInput}
              onTouchStart={() => {
                if (searchedHistoryVisible === false)
                  setSearchedHistroyVisible(true);
              }}
              value={inputText}
              placeholder=" 장소, 버스, 지하철, 주소 검색"
              onChangeText={(text) => setText(text)}
              onSubmitEditing={() => {
                _handlePlacesAPI(inputText);
                setSearchedHistroyVisible(!searchedHistoryVisible);
              }}
            />
          </View>
          {searchedHistoryVisible ? (
            <ScrollView style={{ paddingHorizontal: 20 }}>
              {searchedList?.map((item) => {
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={1}
                    onPress={() => {
                      _handlePlacesAPI(item.text);
                      setSearchedHistroyVisible(!searchedHistoryVisible);
                      searchInput.current.placeholder = `${item.text}`;
                      setText(item.text);
                    }}
                  >
                    <View style={styles.searcehdItem}>
                      <Text style={styles.icon}>
                        {item.type === 'location' ? (
                          <IconSearchedLocation
                            name="location"
                            size={22}
                            color={'#575757'}
                          />
                        ) : (
                          <IconSearchedSearch
                            name="icon-searched-search"
                            size={22}
                            color={'#575757'}
                          />
                        )}
                      </Text>
                      <Text style={styles.searchedText}>{item.text}</Text>
                      <Text
                        id={item.id}
                        style={styles.searchedDeleteText}
                        onPress={() => deleteHistory(item.id)}
                      >
                        삭제
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
              <Text
                onPress={() => deleteAllHistory()}
                style={styles.searchedDeleteAllText}
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
