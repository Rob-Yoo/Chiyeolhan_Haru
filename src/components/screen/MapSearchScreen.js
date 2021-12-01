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
import { fontPercentage } from 'utils/responsiveUtil';

import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'constant/const';

export const MapSearch = ({
  _handlePlacesAPI,
  modalHandler,
  searchedList,
  setSearchedList,
  isFavoriteColor,
  handleFavorite,
  touchLocationData,
}) => {
  const [findlocation, setFindlocation] = useState(false);
  const [inputText, setText] = useState(null);
  const [searchedHistoryVisible, setSearchedHistroyVisible] = useState(null);
  const searchInput = useRef('');
  const toggleModal = () => {
    setSearchedHistroyVisible(!searchedHistoryVisible);
  };

  const deleteAllHistory = async () => {
    searchedList && (await deleteAllSearchedData());
    setSearchedList([]);
  };

  const deleteHistory = async (id) => {
    const tempData = searchedList.filter((item) => item.id !== id);
    await deleteSearchedData(tempData);
    setSearchedList(tempData);
  };

  const handleSubmit = async (e) => {
    const text = e.nativeEvent.text;
    text && (await _handlePlacesAPI(text));
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
              style={[styles.searchInputViewInput]}
              ref={searchInput}
              placeholderTextColor="#A2A2A2"
              onTouchStart={() => {
                !searchedHistoryVisible && setSearchedHistroyVisible(true);
              }}
              value={inputText}
              placeholder="장소, 버스, 지하철, 주소 검색"
              onChangeText={(text) => setText(text)}
              onSubmitEditing={(e) => handleSubmit(e)}
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
                      touchLocationData(item);
                      setFindlocation(true);
                      toggleModal();
                      searchInput.current.placeholder = `${item.location}`;
                      setText(item.location);
                    }}
                  >
                    <View
                      style={[
                        styles.searcehdItem,
                        {
                          flexDirection:
                            item.type === 'candidate' ? 'column' : 'row',
                          paddingVertical: item.type === 'candidate' ? 12 : 14,
                        },
                      ]}
                    >
                      {item.type !== 'candidate' ? (
                        <Text style={styles.icon}>
                          {item.type === 'location' ? (
                            <IconSearchedLocation
                              name="location"
                              size={fontPercentage(17)}
                              color={'#575757'}
                            />
                          ) : (
                            <IconSearchedSearch
                              name="icon-searched-search"
                              size={fontPercentage(17)}
                              color={'#575757'}
                            />
                          )}
                        </Text>
                      ) : null}
                      <Text
                        style={[
                          styles.searchedText,
                          {
                            //maxHeight: 30,
                            maxWidth:
                              item.type !== 'candidate'
                                ? SCREEN_WIDTH * 0.6
                                : null,
                            minWidth: '80%',
                          },
                        ]}
                      >
                        {item?.location?.length > 20
                          ? `${item.location.substring(0, 19)}···`
                          : item.location}
                      </Text>

                      {item.type !== 'candidate' ? (
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
                      ) : (
                        item.road_address_name !== '' && (
                          <View
                            style={{
                              flexDirection: 'row',
                              marginTop: 2,
                            }}
                          >
                            <Text style={[styles.address]}>도로명</Text>
                            <Text style={styles.roadAddress}>
                              {item.road_address_name}
                            </Text>
                          </View>
                        )
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
              <Text
                onPress={() => deleteAllHistory()}
                style={[
                  styles.searchedDeleteAllText,
                  {
                    width:
                      searchedList[0]?.type === 'candidate' ? 0 : 'inherit',
                  },
                ]}
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
  icon: { marginRight: 7, minWidth: '5%' },
  searchedText: {
    fontSize: fontPercentage(16),
    fontWeight: '500',
  },
  searchedDeleteText: {
    borderColor: '#A2A2A2',
    color: '#A2A2A2',
    borderWidth: 1,
    borderRadius: 5,
    fontSize: fontPercentage(15),
    position: 'absolute',
    padding: 3,
    top: 13,
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
    width: '9.5%',
    // height: 30,
    height: '75%',
    paddingTop: 6,
    paddingHorizontal: 5,
  },
  searchInputViewInput: {
    width: '83%',
    //height: SCREEN_HEIGHT * 0.07,
    borderRadius: 10,
    fontSize: 16,
    fontFamily: 'NotoSansKR-Regular',
  },
  searchedDeleteAllText: {
    fontSize: fontPercentage(17),
    marginVertical: 20,
    textAlign: 'center',
  },
  searcehdItem: {
    //backgroundColor: 'red',
    width: '100%',

    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#707070',
  },
  address: {
    fontFamily: 'NotoSansKR-Regular',
    color: '#c4c4c4',
    borderWidth: 1,
    borderColor: '#c4c4c4',
    fontSize: fontPercentage(10),
    height: SCREEN_HEIGHT > 1000 ? 30 : 16,
    fontWeight: '600',
    marginLeft: 4,
    marginRight: 5,
    marginTop: 4,
  },
  roadAddress: {
    fontFamily: 'NotoSansKR-Regular',
    color: 'rgba(0, 0, 0, 0.73)',
    marginTop: 1,
  },
});
