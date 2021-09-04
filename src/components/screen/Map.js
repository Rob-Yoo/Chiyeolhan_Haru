import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-community/async-storage';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { GOOGLE_PLACES_API_KEY } from '@env';
import { MapSearch } from 'components/screen/MapSearch';
import { LocationData } from 'components/items/LocationData';
import IconFindLocation from '#assets/icons/icon-find-current-location.js';
import {
  GOOGLE_API_URL,
  GOOGLE_PARARMS,
  KEY_VALUE_SEARCHED,
} from 'constant/const';
import { handleFilterData } from 'utils/handleFilterData';
import { noDataAlert } from 'utils/TwoButtonAlert';

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  iconFindLocation: {
    top: 140,
    right: -40,
    padding: 7,
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

const CurrentMap = ({
  location,
  modalHandler,
  locationDataHandler,
  searchedList,
  setSearchedList,
}) => {
  const [locationData, setData] = useState(null);
  const [locationResult, setResult] = useState(location);
  const [isCurrentLocation, setIscurrentLocation] = useState(true);

  //useEffect(() => {}, [locationResult]);
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
      setIscurrentLocation(true);
      setResult({ latitude, longitude });
    } catch (e) {
      console.log('handleFindCurrentLocation Error :', e);
    }
  };

  const _handlePlacesAPI = async (text) => {
    try {
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
          setIscurrentLocation(false);
          await handleFilterData(text, 'search', searchedList, setSearchedList);

          break;
        case 'ZERO_RESULTS':
          noDataAlert();
          break;
        case 'OVER_QUERY_LIMIT':
          console.log('API 할당량 넘었음');
          break;
        default:
          console.log(`Error ${status}`);
      }
    } catch (e) {
      console.log('_handlePlacesAPI Error :', e);
    }
  };
  console.log('MAP');

  return (
    <>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={{
          ...locationResult,
          latitudeDelta: 0.004,
          longitudeDelta: 0.004,
        }}
      >
        {/*Map Search*/}
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

        <Marker
          coordinate={{
            latitude: locationResult.latitude,
            longitude: locationResult.longitude,
          }}
          image={{
            uri: isCurrentLocation ? 'customLocation' : 'customPin',
          }}
        />
      </MapView>
      {/*Location Data*/}
      {!!locationData && (
        <LocationData
          locationData={locationData}
          modalHandler={modalHandler}
          locationDataHandler={locationDataHandler}
        />
      )}
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
