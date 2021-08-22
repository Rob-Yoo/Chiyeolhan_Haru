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

import { GOOGLE_PLACES_API_KEY } from '@env';
import { MapSearch } from 'components/MapSearch';
import { LocationData } from 'components/items/LocationData';

import {
  GOOGLE_API_URL,
  GOOGLE_PARARMS,
  KEY_VALUE_SEARCHED,
} from 'constant/const';
import { handleFilterData } from 'utils/handleFilterData';

const CurrentMap = ({
  location,
  modalHandler,
  locationDataHandler,
  searchedList,
  setSearchedList,
}) => {
  const [inputText, setText] = useState('');
  const [isRenderData, setRenderData] = useState(false);
  const [locationData, setData] = useState({});
  const [locationResult, setResult] = useState(location);

  useEffect(() => {}, [locationResult]);
  useEffect(() => {
    const getSearchedList = async () => {
      const searchedData = await AsyncStorage.getItem(KEY_VALUE_SEARCHED);
      setSearchedList(JSON.parse(searchedData));
    };
    getSearchedList();
  }, []);

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

  const _handlePlacesAPI = (text) => {
    // setSearchedList(text);
    const place = text.replaceAll(' ', '%20');
    fetch(
      `${GOOGLE_API_URL}?input=${place}&${GOOGLE_PARARMS}&key=${GOOGLE_PLACES_API_KEY}`,
    )
      .then((response) => response.json())
      .then(async (data) => {
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
      });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={{
          ...locationResult,
          latitudeDelta: 0.004,
          longitudeDelta: 0.004,
        }}
      >
        <MapSearch
          _handlePlacesAPI={_handlePlacesAPI}
          modalHandler={modalHandler}
          searchedList={searchedList}
          setSearchedList={setSearchedList}
        />

        <Marker
          coordinate={{
            latitude: locationResult.latitude,
            longitude: locationResult.longitude,
          }}
        />
        {isRenderData ? (
          <LocationData
            locationData={locationData}
            modalHandler={modalHandler}
            locationDataHandler={locationDataHandler}
          />
        ) : null}
      </MapView>
    </View>
  );
};

const Map = ({
  modalHandler,
  locationDataHandler,
  searchedList,
  setSearchedList,
}) => {
  const appState = useRef(AppState.currentState);

  const [stateVisible, setStateVisible] = useState(appState.current);
  const [isFind, setFind] = useState(false);
  const [location, setLocation] = useState({});

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);
    getLocation();
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, [isFind]);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      getLocation();
    }

    appState.current = nextAppState;
    setStateVisible(appState.current);
  };
  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setFind(false);
        return;
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
      location={location}
      modalHandler={modalHandler}
      locationDataHandler={locationDataHandler}
      searchedList={searchedList}
      setSearchedList={setSearchedList}
    />
  ) : (
    <Text>Loading...</Text>
  );
};

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
});

export default Map;
