import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  AppState,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-community/async-storage';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import BackgroundGeolocation from 'react-native-background-geolocation';

import { GOOGLE_PLACES_API_KEY } from '@env';
import { MapSearch } from 'components/MapSearch';
import { LocationData } from 'components/items/LocationData';

import IconFindLocation from '#assets/icons/icon-find-current-location.js';
import IconFavorite from '#assets/icons/icon-favorite.js';
import {
  GOOGLE_API_URL,
  GOOGLE_PARARMS,
  KEY_VALUE_SEARCHED,
} from 'constant/const';
import { handleFilterData } from 'utils/handleFilterData';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  iconFindLocation: {
    top: 150,
    right: 30,
    padding: 7,
    position: 'absolute',
    width: 40,
    height: 40,

    borderRadius: 50,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 3.4,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
});

const CurrentMap = ({
  location,
  modalHandler,
  locationDataHandler,
  searchedList,
  setSearchedList,
  navigation,
}) => {
  const [inputText, setText] = useState('');
  const [isRenderData, setRenderData] = useState(false);
  const [locationData, setData] = useState({});
  const [locationResult, setResult] = useState(location);

  useEffect(() => {}, [locationResult]);
  useEffect(() => {
    const getSearchedList = async () => {
      try {
        const searchedData = await AsyncStorage.getItem(KEY_VALUE_SEARCHED);
        setSearchedList(JSON.parse(searchedData));
      } catch (e) {
        console.log('getSearchedList Error :', e);
      }
    };
    getSearchedList();
  }, []);

  const handleFindCurrentLocation = async () => {
    try {
      const result = await Location.getLastKnownPositionAsync();
      const {
        coords: { latitude, longitude },
      } = result;
      setResult({ latitude, longitude });
    } catch (e) {
      console.log('handleFindCurrentLocation Error :', e);
    }
  };
  const createTwoButtonAlert = () =>
    Alert.alert(
      '검색 결과가 없습니다.',
      '',
      [
        {
          text: '취소',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: '확인', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );

  const _handlePlacesAPI = async (text) => {
    const place = text.replaceAll(' ', '%20');
    const response = await fetch(
      `${GOOGLE_API_URL}?input=${place}&${GOOGLE_PARARMS}&key=${GOOGLE_PLACES_API_KEY}`,
    );
    const data = await response.json();
    const status = data.status;
    switch (status) {
      case 'OK':
        const {
          candidates: [
            {
              formatted_address: address,
              geometry: {
                location: { lat: latitude, lng: longitude },
              },
              name: location,
            },
          ],
        } = data;
        setResult({
          latitude,
          longitude,
        });
        setData({ location, latitude, longitude, address });
        handleFilterData(text, 'search', searchedList, setSearchedList);
        setRenderData(true);
        break;
      case 'ZERO_RESULTS':
        createTwoButtonAlert();
        break;
      case 'OVER_QUERY_LIMIT':
        console.log('API 할당량 넘었음');
        break;
      default:
        console.log(`Error ${status}`);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          region={{
            ...locationResult,
            latitudeDelta: 0.004,
            longitudeDelta: 0.004,
          }}
          onPress={() => console.log('touch')}
        >
          <View style={{ flex: 1 }}>
            <MapSearch
              _handlePlacesAPI={_handlePlacesAPI}
              modalHandler={modalHandler}
              searchedList={searchedList}
              setSearchedList={setSearchedList}
            />
            <IconFindLocation
              size={30}
              name="icon-find-current-location"
              style={styles.iconFindLocation}
              color="#00000041"
              onPress={() => handleFindCurrentLocation()}
            />
          </View>

          <View
            style={{
              flex: 1,
              bottom: 0,
            }}
          >
            {/* <IconFavorite
              size={60}
              name="icon-favorite"
              style={{
                position: 'absolute',
                borderRadius: 50,
                bottom: isRenderData ? 160 : 10,
                left: 20,
              }}
              onPress={() => console.log('favorite도modal로띄우냐고')}
            /> */}

            {isRenderData ? (
              <LocationData
                locationData={locationData}
                modalHandler={modalHandler}
                locationDataHandler={locationDataHandler}
              />
            ) : (
              <></>
            )}
          </View>
          <Marker
            coordinate={{
              latitude: locationResult.latitude,
              longitude: locationResult.longitude,
            }}
            image={{ uri: 'custom_pin' }}
          />
        </MapView>
      </View>
    </>
  );
};

const Map = ({
  modalHandler,
  locationDataHandler,
  searchedList,
  setSearchedList,
  navigation,
}) => {
  const [isFind, setFind] = useState(false);
  const [location, setLocation] = useState({});

  useEffect(() => {
    const getLoctionTrigger = async () => {
      await getLocation();
    };
    getLoctionTrigger();
  }, [isFind]);

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status != 'granted') {
        setFind(false);
      } else {
        const locationData = await Location.getCurrentPositionAsync();
        const curretLocation = {
          latitude: locationData.coords.latitude,
          longitude: locationData.coords.longitude,
        };
        setLocation(curretLocation);
        setFind(true);
      }
    } catch (e) {
      console.log('getLocation Error :', e);
    }
  };

  return isFind ? (
    <CurrentMap
      navigation={navigation}
      location={location}
      modalHandler={modalHandler}
      locationDataHandler={locationDataHandler}
      searchedList={searchedList}
      setSearchedList={setSearchedList}
    />
  ) : (
    <></>
  );
};

export default Map;
