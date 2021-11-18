import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import IconGobackButton from '#assets/icons/icon-go-back-button';
import IconSearchedSearch from '#assets/icons/icon-searched-search';
import IconSearchedLocation from '#assets/icons/icon-searched-location';
import IconStarBorder from '#assets/icons/icon-star-border';

import {
  deleteSearchedData,
  deleteAllSearchedData,
} from 'utils/asyncStorageUtil';

import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'constant/const';

export const MapSearch = ({
  _handlePlacesAPI,
  modalHandler,
  searchedList,
  setSearchedList,
  isFavoriteColor,
  handleFavorite,
  isFind,
}) => {
  const [findlocation, setFindlocation] = useState(false);
  const [inputText, setText] = useState(null);
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
          <View style={styles.searchInput}>
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
              placeholderTextColor="#A2A2A2"
              onTouchStart={() => {
                !searchedHistoryVisible && setSearchedHistroyVisible(true);
              }}
              value={inputText}
              placeholder=" 장소, 버스, 지하철, 주소 검색"
              onChangeText={(text) => setText(text)}
              onSubmitEditing={() => {
                _handlePlacesAPI(inputText);
                setFindlocation(true);
                toggleModal();
              }}
            />
            {isFavoriteColor && (
              <IconStarBorder
                name="icon-favorite"
                size={23}
                color={isFavoriteColor}
                style={{ width: '10%' }}
                onPress={() => handleFavorite()}
              />
            )}
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
                      <Text
                        style={[
                          styles.searchedText,
                          {
                            maxHeight: 40,
                            maxWidth: SCREEN_WIDTH * 0.6,
                            minWidth: '80%',
                          
                          },
                        ]}
                      >
                        {item.text.length > 14
                          ? `${item.text.substring(0, 13)}···`
                          : item.text}
                      </Text>

                      <Text
                        id={item.id}
                        style={[
                          styles.searchedDeleteText,
                          { backgroundColor: '#fff' },
                        ]}
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

const styles = StyleSheet.create({
  mapSearchContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  searchInput: {
    width: '90%',
    height: 40,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
    shadowColor: '#0000002E',
    shadowOpacity: 0.6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  searchedHistoryContainer: {
    flex: 1,
    width: '100%',
    height: 800,
    backgroundColor: '#fff',
  },
  icon: { marginRight: 10, minWidth: 20 },
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
    alignItems: 'flex-end',
    height: 140,
    backgroundColor: '#54BCB6',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingBottom: 20,
  },
  searchInputViewBackButton: {
    width: '10%',
    height: 30,
    paddingTop: 6,
    paddingHorizontal: 5,
  },
  searchInputViewInput: {
    width: '80%',
    //height: SCREEN_HEIGHT * 0.07,
    borderRadius: 10,
    fontSize: 16,

    fontFamily: 'NotoSansKR-Regular',
  },
  searchedDeleteAllText: {
    fontSize: 20,
    marginVertical: 25,
    textAlign: 'center',
  },
  searcehdItem: {
    //backgroundColor: 'red',
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#707070',
  },
});
