import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

import IconQuestion from '#assets/icons/icon-question';
import IconAngleDown from '#assets/icons/icon-angle-down';
import IconSearchedLocation from '#assets/icons/icon-searched-location';

import { getDataFromAsync } from 'utils/AsyncStorage';

import { KEY_VALUE_FAVORITE } from 'constant/const';

const defaultRender = () => {
  let defaultArray = [];
  for (let i = 0; i < 6; i++) {
    defaultArray.push(
      <View
        key={`DEFAULT${i}`}
        style={{
          width: '44%',
          height: 160,
          backgroundColor: '#fff',
          borderRadius: 20,
          margin: 10,
          shadowColor: '#00000029',

          shadowOpacity: 0.5,
          shadowRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
        }}
      >
        <IconQuestion
          name="icon-question"
          style={{ position: 'absolute' }}
          color={'#B1E4E2'}
          size={120}
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

  const scrollToEndFavorite = () => scrollViewRef.current.scrollToEnd();

  useEffect(() => {
    getFavoriteAsync(setFavorite, setLoading);
  }, []);

  const pressFavorite = (favorite) => {
    locationDataHandler(favorite);
    modalHandler();
  };

  if (!loading) {
    return <Text>LOADING</Text>;
  }
  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          flexGrow: 1,
        }}
        style={styles.modalTopContainer}
      >
        {favorite?.map((item, index) => {
          return (
            <TouchableOpacity
              onPress={() => pressFavorite(item, index)}
              key={`FAVORITE${index}`}
              style={{
                width: '44%',
                height: 160,
                backgroundColor: '#fff',
                borderRadius: 20,
                margin: 10,
                shadowColor: '#00000029',
                shadowOpacity: 0.5,
                shadowRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
              }}
            >
              <IconSearchedLocation
                name="location"
                style={{ position: 'absolute' }}
                color={'#B1E4E2'}
                size={120}
              />
              <Text style={{ fontFamily: 'notoSansKR-Bold', fontSize: 25 }}>
                {item.location}
              </Text>
            </TouchableOpacity>
          );
        })}
        {defaultRender()}
      </ScrollView>
      <View
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
      </View>

      {/* <ToDoModal
        navigation={navigation}
        modalHandler={() => toggleModal()}
        passModalData={passModalData}
        setPassModalData={setPassModalData}
        isModalVisible={isModalVisible}
        isToday={isToday}
        navigateFavorite={() =>
          navigation.navigate('ScheduleToday', {
            screen: 'ScheduleToday',
          })
        }
      /> */}
    </>
  );
};

const styles = StyleSheet.create({
  modalInputContainer: {
    backgroundColor: '#54BCB6',
    height: '100%',
    flex: 1,
  },
  modalTopContainer: {
    borderRadius: 10,
    backgroundColor: '#fff',
    marginTop: 100,
    width: '100%',
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 20,
    position: 'relative',
  },
  searchInputContainer: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    position: 'relative',
    backgroundColor: '#fff',
    width: '90%',
    height: 50,
    borderRadius: 10,
  },
  searchInputViewBackButton: {
    width: 30,
    height: 30,
  },
});
