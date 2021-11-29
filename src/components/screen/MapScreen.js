import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, TouchableOpacity, AppState } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { GOOGLE_PLACES_API_KEY } from '@env';

import { MapSearch } from 'components/screen/MapSearchScreen';
import { LocationData } from 'components/items/LocationData';

import { getDataFromAsync, setFavoriteData } from 'utils/asyncStorageUtil';
import { handleFilterData } from 'utils/handleFilterData';
import {
  noDataAlert,
  favoriteAlert,
  limitRequestAlert,
  requestDeniedAlert,
  invalidRequestAlert,
  errorNotifAlert,
  permissionDenyAlert,
  deleteFavoriteAlert,
} from 'utils/buttonAlertUtil';

import {
  GOOGLE_API_URL,
  GOOGLE_PARARMS,
  KEY_VALUE_SEARCHED,
  KEY_VALUE_FAVORITE,
} from 'constant/const';
import { Loading } from './LoadingScreen';

import IconFindCurrent from '#assets/icons/icon-find-current-location';
import { sqrt } from 'react-native-reanimated';

const filterFavoriteReturnStarColor = async (latitude, longitude) => {
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
        favoriteAlert();
        return setIsFavoriteColor('#FECC02');
      }

      if (
        favoriteAsyncData.some(
          (item) =>
            item.longitude === locationData.longitude &&
            item.latitude === locationData.latitude,
        )
      ) {
        //favorite 일때
        const tempData = favoriteAsyncData.filter(
          (item) =>
            !(
              item.latitude === locationData.latitude &&
              item.longitude === locationData.longitude
            ),
        );
        await setFavoriteData(tempData);
        deleteFavoriteAlert();
        return setIsFavoriteColor(
          await filterFavoriteReturnStarColor(
            locationData.latitude,
            locationData.longitude,
          ),
        );
      } else {
        //favorite가 아닐때
        await setFavoriteData([updateData, ...favoriteAsyncData]);
        favoriteAlert();
        return setIsFavoriteColor(
          await filterFavoriteReturnStarColor(
            locationData.latitude,
            locationData.longitude,
          ),
        );
      }
    }
  } catch (e) {
    errorNotifAlert(`handleFavorite Error : ${e}`);
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
  const [isFavoriteColor, setIsFavoriteColor] = useState(null);

  useEffect(() => {
    const getSearchedList = async () => {
      try {
        const searchedData = await getDataFromAsync(KEY_VALUE_SEARCHED);
        setSearchedList(searchedData);
      } catch (e) {
        errorNotifAlert(`getSearchedList Error : ${e}`);
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
      errorNotifAlert(`handleFindCurrentLocation Error : ${e}`);
    }
  };

  const _handleCandidate = async (text) => {
    try {
      const response = await fetch(
        `${GOOGLE_API_URL}/autocomplete/json?input=${text}&${GOOGLE_PARARMS}&key=${GOOGLE_PLACES_API_KEY}`,
      );
      const data = await response.json();
      const status = data.status;
      let result;
      switch (status) {
        case 'OK':
          result = data.predictions[0].place_id;
          break;
        case 'ZERO_RESULTS':
          result = 'ZERO_RESULTS';
          break;
        case 'OVER_QUERY_LIMIT':
          result = 'OVER_QUERY_LIMIT';
          break;
        case 'REQUEST_DENIED':
          result = 'REQUEST_DENIED';
          break;
        case 'INVALID_REQUEST':
          result = 'INVALID_REQUEST';
          break;
        default:
          errorNotifAlert(`Error ${status}`);
      }
      return result;
    } catch (e) {
      errorNotifAlert(`_handleCandidate Error : ${e}`);
    }
  };

  const _handlePlacesAPI = async (text) => {
    try {
      const result = await _handleCandidate(text);
      let status;
      let data;

      if (result.length > 16) {
        const response = await fetch(
          `${GOOGLE_API_URL}/details/json?place_id=${result}&key=${GOOGLE_PLACES_API_KEY}`,
        );
        data = await response.json();
        status = data.status;
      } else {
        status = result;
      }

      switch (status) {
        case 'OK':
          let {
            result: {
              name: location,
              formatted_address: address,
              geometry: {
                location: { lat: latitude, lng: longitude },
              },
            },
          } = data;
          const charCode = String.fromCharCode(8722);

          if (location.includes(charCode)) {
            const num1 = location.split(charCode)[0];
            const num2 = location.split(charCode)[1];
            if (parseInt(num1, 10) !== NaN && parseInt(num2, 10) !== NaN) {
              const dong = data.result.address_components[1].short_name;
              let cleanS1 = String.fromCharCode(location.charCodeAt(0) - 65248);
              for (let i = 1; i < location.length; i++) {
                if (location.charCodeAt(i) == 8722) {
                  cleanS1 = cleanS1 + String.fromCharCode(45);
                } else {
                  cleanS1 =
                    cleanS1 +
                    String.fromCharCode(location.charCodeAt(i) - 65248);
                }
              }
              location = `${dong} ` + cleanS1;
            }
          } else if (address.includes(text)) {
            const s1 = data.result.address_components[0].short_name;
            const s2 = data.result.address_components[1].short_name;

            if (65297 <= s1.charCodeAt(0) && s1.charCodeAt(0) <= 65306) {
              let cleanS1 = String.fromCharCode(s1.charCodeAt(0) - 65248);
              for (let i = 1; i < s1.length; i++) {
                cleanS1 =
                  cleanS1 + String.fromCharCode(s1.charCodeAt(i) - 65248);
              }
              location = `${s2} ` + cleanS1;
            } else {
              location = `${s2} ` + s1;
            }
            if (s1 === s2) {
              location = s1;
            }
          }
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
          limitRequestAlert();
          break;
        case 'REQUEST_DENIED':
          requestDeniedAlert();
          break;
        case 'INVALID_REQUEST':
          invalidRequestAlert();
          break;
        default:
          errorNotifAlert(`Error ${status}`);
      }
    } catch (e) {
      errorNotifAlert(`_handlePlacesAPI Error : ${e}`);
    }
  };
  return (
    <>
      {/*MapView*/}
      <MapView
        style={styles.map}
        userInterfaceStyle={'light'}
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
        style={{
          position: 'absolute',
          top: 155,
          right: 15,
          backgroundColor: '#fff',
          borderRadius: 100,
          shadowColor: '#00000050',
          shadowOffset: {
            height: 2,
          },
          shadowOpacity: 0.5,
        }}
        onPress={() => handleFindCurrentLocation()}
      >
        <IconFindCurrent
          name="icon-find-current-location"
          size={17}
          color="#575757"
          style={styles.iconFindCurrentLocation}
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
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    AppState.addEventListener('change', __handleAppStateChange);
    getLocation();
    return () => {
      setLocation(false);
      AppState.removeEventListener('change', __handleAppStateChange);
    };
  }, []);

  const __handleAppStateChange = async (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if (!isFind) {
        getLocation();
      }
    }
    appState.current = nextAppState;
  };

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setFind(false);
        permissionDenyAlert();
      } else {
        const locationData = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Lowest,
        });
        const curretLocation = {
          latitude: locationData.coords.latitude,
          longitude: locationData.coords.longitude,
        };
        setLocation(curretLocation);
        setFind(true);
      }
    } catch (e) {
      errorNotifAlert(`getLocation Error : ${e}`);
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
      isFind={isFind}
    />
  ) : (
    <Loading />
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  iconFindCurrentLocation: {
    width: 30,
    height: 30,
    paddingVertical: 6.5,
    paddingHorizontal: 6.95,
  },
});

export default Map;
