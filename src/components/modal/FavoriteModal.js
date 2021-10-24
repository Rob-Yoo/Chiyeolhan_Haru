import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from 'react-native';

import IconQuestion from '#assets/icons/icon-question';
import IconGobackButton from '#assets/icons/icon-go-back-button';
import IconSearchedLocation from '#assets/icons/icon-searched-location';
import IconMinusCircle from '#assets/icons/icon-minus-circle';

import { getDataFromAsync, setFavoriteData } from 'utils/asyncStorageUtil';

import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  KEY_VALUE_FAVORITE,
} from 'constant/const';

const defaultRender = (favoriteLength) => {
  let defaultArray = [];
  favoriteLength = favoriteLength === undefined ? 0 : favoriteLength;

  for (let i = 0; i + favoriteLength < 8; i++) {
    defaultArray.push(
      <View key={`DEFAULT${i}`} style={styles.favoriteCard}>
        <IconQuestion
          name="icon-question"
          style={{ position: 'absolute' }}
          color={'#B1E4E2'}
          size={80}
        />
      </View>,
    );
  }
  return defaultArray;
};

const getFavoriteAsync = async (setFavorite, setLoading) => {
  try {
    setFavorite(await getDataFromAsync(KEY_VALUE_FAVORITE));
    setLoading(true);
  } catch (e) {
    console.log('getFavoriteError', e);
  }
};

export const FavoriteModal = ({ modalHandler, locationDataHandler }) => {
  const scrollViewRef = useRef();
  const [favorite, setFavorite] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getFavoriteAsync(setFavorite, setLoading);
  }, []);

  const pressFavorite = (favorite) => {
    locationDataHandler(favorite);
    modalHandler();
  };

  const deleteFavorite = (item) => {
    const filterData = favorite.filter((v) => v.address !== item.address);
    setFavorite(filterData);
    setFavoriteData(filterData);
  };

  if (!loading) {
    return <Text>LOADING</Text>;
  }

  return (
    <View style={{ marginTop: '30%', height: SCREEN_HEIGHT / 1.3 }}>
      <View style={{ height: '100%' }}>
        <ImageBackground
          imageStyle={{
            height: SCREEN_HEIGHT,
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
          }}
          style={[styles.modalTopContainer]}
          source={{ uri: 'favoriteBackground' }}
        >
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              flexWrap: 'wrap',
              flexGrow: 1,
              paddingBottom: 100,
            }}
          >
            {favorite?.map((item, index) => {
              return (
                <View key={index} style={styles.favoriteCard}>
                  <TouchableOpacity
                    onPress={() => pressFavorite(item, index)}
                    key={`${index}`}
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <IconSearchedLocation
                      name="location"
                      style={{ position: 'absolute' }}
                      color={'#B1E4E2'}
                      size={80}
                    />
                    <Text
                      style={{
                        fontFamily: 'notoSansKR-Bold',
                        fontSize: item.location.length > 10 ? 18 : 23,
                      }}
                    >
                      {item.location}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => deleteFavorite(item)}
                    style={{ position: 'absolute', top: 10, right: 10 }}
                  >
                    <IconMinusCircle
                      name="minus-circle"
                      size={18}
                      color="#54BCB6"
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
            {defaultRender(favorite?.length)}
          </ScrollView>
          <TouchableOpacity onPress={modalHandler} style={styles.buttonGoBack}>
            <IconGobackButton
              color="#54BCB6"
              name="icon-go-back-button"
              size={18}
            />
          </TouchableOpacity>
        </ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalTopContainer: {
    paddingTop: 35,
    paddingLeft: '18%',
  },

  searchInputViewBackButton: {
    width: 30,
    height: 30,
  },
  favoriteCard: {
    margin: 10,
    padding: 10,
    height: 125,
    width: 125,
    borderRadius: 20,
    shadowColor: '#0000001A',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 5,
    shadowOpacity: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  buttonGoBack: {
    width: 30,
    height: 30,
    backgroundColor: '#fff',
    borderRadius: 50,
    shadowColor: '#00000041',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.0486,
    left: SCREEN_WIDTH * 0.06,
  },
});
