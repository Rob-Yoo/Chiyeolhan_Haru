import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { deleteSearchedData, deleteAllSearchedData } from 'utils/AsyncStorage';

import IconGobackButton from '#assets/icons/icon-go-back-button';
import IconSearchedSearch from '#assets/icons/icon-searched-search';
import IconSearchedLocation from '#assets/icons/icon-searched-location';
import IconStarBorder from '#assets/icons/icon-star-border';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'components/screen/Home';

const styles = StyleSheet.create({
  mapSearchContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  searchedHistoryContainer: {
    flex: 1,
    width: '100%',
    height: 800,
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
  searchInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 140,
    backgroundColor: '#54BCB6',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingTop: 20,
  },
  // searchInputView: {
  //   backgroundColor: '#fff',
  //   width: '90%',
  //   height: 50,
  //   borderRadius: 10,
  // },
  searchInputViewBackButton: {
    width: '10%',
    height: 30,
    paddingTop: 5,
    paddingHorizontal: 10,
  },
  searchInputViewInput: {
    width: '80%',
    height: SCREEN_HEIGHT * 0.05,
    borderRadius: 10,
    fontSize: 19,
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
  isFavoriteColor,
  handleFavorite,
}) => {
  const [inputText, setText] = useState('');
  const [searchedHistoryVisible, setSearchedHistroyVisible] = useState(null);
  const searchInput = useRef('');

  const toggleModal = () => {
    setSearchedHistroyVisible(!searchedHistoryVisible);
  };

  const deleteAllHistory = async () => {
    await deleteAllSearchedData();
    setSearchedList([]);
  };

  const deleteHistory = async (id) => {
    const tempData = searchedList.filter((item) => item.id !== id);
    await deleteSearchedData(tempData);
    setSearchedList(tempData);
  };
  return (
    <View style={styles.mapSearchContainer}>
      <View
        style={{
          flex: 1,
          width: '100%',
          height: searchedHistoryVisible ? SCREEN_HEIGHT : 0,
          backgroundColor: '#fff',
        }}
      >
        <View style={styles.searchInputContainer}>
          <View
            style={{
              width: '90%',
              backgroundColor: '#fff',
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 10,
              paddingHorizontal: 10,
            }}
          >
            <IconGobackButton
              name="icon-go-back-button"
              size={18}
              style={styles.searchInputViewBackButton}
              onPress={() => {
                searchedHistoryVisible ? toggleModal() : modalHandler();
              }}
            />
            <TextInput
              style={styles.searchInputViewInput}
              ref={searchInput}
              onTouchStart={() => {
                !searchedHistoryVisible && setSearchedHistroyVisible(true);
              }}
              value={inputText}
              placeholder=" 장소, 버스, 지하철, 주소 검색"
              onChangeText={(text) => setText(text)}
              onSubmitEditing={() => {
                _handlePlacesAPI(inputText);
                toggleModal();
              }}
            />
            <IconStarBorder
              name="icon-favorite"
              size={23}
              color={isFavoriteColor}
              style={{ paddingHorizontal: 10, width: '10%' }}
              onPress={() => handleFavorite()}
            />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          {searchedHistoryVisible && (
            <ScrollView
              bounces={false}
              contentContainerStyle={{
                flexGrow: 1,
              }}
              style={{ paddingHorizontal: 20 }}
            >
              {searchedList?.map((item) => {
                return (
                  <TouchableOpacity
                    key={`${item.id}`}
                    activeOpacity={1}
                    onPress={() => {
                      _handlePlacesAPI(item.text);
                      toggleModal();
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
          )}
        </View>
      </View>
    </View>
  );
};
