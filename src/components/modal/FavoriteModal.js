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

import { getDataFromAsync, setFavoriteData } from 'utils/AsyncStorage';

import { KEY_VALUE_FAVORITE } from 'constant/const';

const defaultRender = () => {
  let defaultArray = [];

  for (let i = 0; i < 8; i++) {
    defaultArray.push(
      <View key={`DEFAULT${i}`} style={styles.favoriteCard}>
        <IconQuestion
          name="icon-question"
          style={{ position: 'absolute' }}
          color={'#B1E4E2'}
          size={100}
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
  const [favorite, setFavorite] = useState(null);
  const [loading, setLoading] = useState(false);
  let backupData = [];

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
    <View style={{ flex: 1, marginTop: 100 }}>
      <ImageBackground
        imageStyle={{ borderRadius: 50 }}
        style={[styles.modalTopContainer]}
        source={{ uri: 'favoriteBackground' }}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
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
                    size={100}
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
          {defaultRender()}
          <TouchableOpacity onPress={modalHandler} style={styles.buttonGoBack}>
            <IconGobackButton
              color="#54BCB6"
              name="icon-go-back-button"
              size={18}
            />
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
      {/* <View
        style={{
          backgroundColor: '#fff',
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: 60,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconAngleDown
          onPress={() => scrollToEndFavorite()}
          name="icon-angle-down"
          size={20}
        />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  modalTopContainer: {
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },

  searchInputViewBackButton: {
    width: 30,
    height: 30,
  },
  favoriteCard: {
    margin: 10,
    padding: 10,
    height: 140,
    width: '39%',
    shadowRadius: 8,
    borderRadius: 20,
    shadowOpacity: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#00000029',
  },
  buttonGoBack: {
    width: 30,
    height: 30,
    backgroundColor: '#fff',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    position: 'absolute',
    top: 5,
    left: 10,
  },
});
