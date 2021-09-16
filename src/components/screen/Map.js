import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { GOOGLE_PLACES_API_KEY } from '@env';
import { MapSearch } from 'components/screen/MapSearch';
import { LocationData } from 'components/items/LocationData';
import { getDataFromAsync } from 'utils/AsyncStorage';
import {
  GOOGLE_API_URL,
  GOOGLE_PARARMS,
  KEY_VALUE_SEARCHED,
  KEY_VALUE_FAVORITE,
} from 'constant/const';
import { handleFilterData } from 'utils/handleFilterData';
import { noDataAlert } from 'utils/TwoButtonAlert';
import { setFavoriteData } from 'utils/AsyncStorage';

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  iconFindCurrentLocation: {
    width: 45,
    height: 45,

    shadowColor: '#00000029',
    shadowOffset: {
      width: 5.4,
      height: 6,
    },
    shadowOpacity: 5,
    shadowRadius: 2.84,
  },
});

const filterFavoriteReturnStarColor = async (latitude, longitude) => {
  // await AsyncStorage.removeItem(KEY_VALUE_FAVORITE);
  const favoriteArray = await getDataFromAsync(KEY_VALUE_FAVORITE);
  if (favoriteArray === null) return '#575757';
  const isfavoriteColor =
    favoriteArray.filter((item) => {
      return item.latitude === latitude && item.longitude === longitude;
    }).length !== 0
      ? '#FECC02'
      : '#575757';
  return isfavoriteColor;
};

const handleFavorite = async (locationData, setIsFavoriteColor) => {
  //검색한 locationData의 값과 asyncFavorite 의 위도와 경도를 비교해서
  //favorite으로 저장해놨다면 (asyncFavorite에 있다면) 해당 값을 리턴
  try {
    if (locationData !== null) {
      const favoriteAsyncData = await getDataFromAsync(KEY_VALUE_FAVORITE);
      const updateData = {
        location: locationData.location,
        longitude: locationData.longitude,
        latitude: locationData.latitude,
        address: locationData.address,
      };
      if (favoriteAsyncData === null) {
        //제일 처음 데이터가 없을때는 데이터를 넣고 걍 페이보릿색으로 바꿔주고 리턴
        await setFavoriteData([locationData]);
        return setIsFavoriteColor('#FECC02');
      }

      if (
        favoriteAsyncData.some(
          (item) =>
            item.longitude === locationData.longitude &&
            item.latitude === locationData.latitude,
        )
      ) {
        //favorite 이란 얘기임
        const tempData = favoriteAsyncData.filter(
          (item) =>
            !(
              item.latitude === locationData.latitude &&
              item.longitude === locationData.longitude
            ),
        );
        await setFavoriteData(tempData);
        return setIsFavoriteColor(
          await filterFavoriteReturnStarColor(
            locationData.latitude,
            locationData.longitude,
          ),
        );
      } else {
        //favorite가 아니란 얘기임
        await setFavoriteData([updateData, ...favoriteAsyncData]);
        return setIsFavoriteColor(
          await filterFavoriteReturnStarColor(
            locationData.latitude,
            locationData.longitude,
          ),
        );
      }
    }
  } catch (e) {
    console.log('handleFavorite Error', e);
  }
};

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
  const [isFavoriteColor, setIsFavoriteColor] = useState('#575757');

  useEffect(() => {
    const getSearchedList = async () => {
      try {
        const searchedData = await getDataFromAsync(KEY_VALUE_SEARCHED);
        setSearchedList(searchedData);
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
          setIscurrentLocation(false);
          setData({ location, latitude, longitude, address });
          //필터 돌려서 즐겨찾기 색 넘겨주는 함수
          setIsFavoriteColor(
            await filterFavoriteReturnStarColor(latitude, longitude),
          );
          //검색기록 필터
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
  return (
    <>
      {/*MapView*/}
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={{
          ...locationResult,
          latitudeDelta: 0.004,
          longitudeDelta: 0.004,
        }}
      >
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
      {/*MapView End*/}

      <TouchableOpacity
        style={{ position: 'absolute', top: 150, right: 10 }}
        onPress={() => handleFindCurrentLocation()}
      >
        <ImageBackground
          style={styles.iconFindCurrentLocation}
          activeOpacity={1}
          source={{ uri: 'iconFindCurrentLocation' }}
        />
      </TouchableOpacity>

      {/*Location Data*/}
      {!!locationData && (
        <LocationData
          locationData={locationData}
          modalHandler={modalHandler}
          locationDataHandler={locationDataHandler}
        />
      )}

      {/*Map Search*/}
      <MapSearch
        _handlePlacesAPI={_handlePlacesAPI}
        modalHandler={modalHandler}
        searchedList={searchedList}
        setSearchedList={setSearchedList}
        isFavoriteColor={isFavoriteColor}
        handleFavorite={() => handleFavorite(locationData, setIsFavoriteColor)}
      />
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
