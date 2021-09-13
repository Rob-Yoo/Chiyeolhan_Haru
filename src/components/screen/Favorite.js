import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { KEY_VALUE_FAVORITE } from 'constant/const';
import { getDataFromAsync } from 'utils/AsyncStorage';
import ToDoModalFavorite from 'components/modal/ToDoModalFavorite';

import IconQuestion from '#assets/icons/icon-question';
import IconGobackButton from '#assets/icons/icon-go-back-button';
import IconSearchedLocation from '#assets/icons/icon-searched-location';

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

const defaultRender = () => {
  let defaultArray = [];
  for (let i = 0; i < 7; i++) {
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

export const Favorite = ({ navigation, route }) => {
  const { isToday } = route.params;
  const [isModalVisible, setModalVisible] = useState(false);
  const [passModalData, setPassModalData] = useState(undefined);
  const [favorite, setFavorite] = useState(null);
  const [loading, setLoading] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const getFavoriteAsync = async () => {
    try {
      setFavorite(await getDataFromAsync(KEY_VALUE_FAVORITE));
      setLoading(true);
    } catch (e) {
      console.log('getFavoriteError', e);
    }
  };
  useEffect(() => {
    getFavoriteAsync();
  }, []);

  const scrollView = useRef();
  const pressFavorite = (favorite) => {
    setPassModalData(favorite);
    toggleModal();
  };

  if (!loading) {
    return <Text>LOADING</Text>;
  }
  return (
    <>
      {/* <View
        style={{
          flex: 1,
          backgroundColor: '#54BCB6',
          height: '80%',
        }}
      > */}
      <View
        style={{
          flex: 1,
          // paddingTop: 80,
          alignItems: 'center',
          backgroundColor: '#54BCB6',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 100,
            left: 10,
            width: 50,
            height: 50,
          }}
          onPress={() => navigation.goBack()}
        >
          {/* <IconGobackButton
              name="icon-go-back-button"
              size={25}
              style={styles.searchInputViewBackButton}
            /> */}
        </TouchableOpacity>

        <ScrollView
          ref={scrollView}
          contentContainerStyle={{
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
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
      </View>
      {/* </View> */}

      <ToDoModalFavorite
        navigation={navigation}
        modalHandler={() => toggleModal()}
        passModalData={passModalData}
        setPassModalData={setPassModalData}
        isModalVisible={isModalVisible}
        isToday={isToday}
      />
    </>
  );
};
