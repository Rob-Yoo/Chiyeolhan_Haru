import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, TouchableOpacity, AppState } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { KAKAO_REST_API_KEY } from '@env';

import { MapSearch } from 'components/screen/MapSearchScreen';
import { LocationData } from 'components/items/LocationData';

import { getDataFromAsync, setFavoriteData } from 'utils/asyncStorageUtil';
import { handleFilterData } from 'utils/handleFilterData';
import {
  noDataAlert,
  favoriteAlert,
  errorNotifAlert,
  permissionDenyAlert,
  deleteFavoriteAlert,
} from 'utils/buttonAlertUtil';

import {
  KAKAO_API_URL,
  KEY_VALUE_SEARCHED,
  KEY_VALUE_FAVORITE,
} from 'constant/const';
import { Loading } from './LoadingScreen';

import IconFindCurrent from '#assets/icons/icon-find-current-location';

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

        favoriteAlert(locationData.location);
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
        favoriteAlert(locationData.location);
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
  let candidate = [];
  const [locationData, setLocationData] = useState(null);
  const [locationResult, setLocationResult] = useState(location);
  const [isCurrentLocation, setIscurrentLocation] = useState(true);
  const [isFavoriteColor, setIsFavoriteColor] = useState(null);
  const [candidateState, setCandidate] = useState(candidate);
  const [type, setType] = useState('searched');
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
      setLocationResult({ latitude, longitude });
    } catch (e) {
      errorNotifAlert(`handleFindCurrentLocation Error : ${e}`);
    }
  };

  const getCandidate = (documents) => {
    setType('candidate');
    documents.map((data) => {
      const { place_name, road_address_name, id, x, y } = data;
      candidate.push({
        address: road_address_name,
        text: place_name,
        location: place_name,
        longitude: x * 1,
        latitude: y * 1,
        id,
        type: 'candidate',
      });
    });
  };

  const touchLocationData = async (locationData) => {
    const { location, address, id } = locationData;
    const latitude = locationData.latitude * 1; // string -> number
    const longitude = locationData.longitude * 1;

    setLocationResult({
      latitude,
      longitude,
    });
    setIscurrentLocation(false);
    setLocationData({ location, latitude, longitude, address });
    // 필터 돌려서 즐겨찾기 색 넘겨주는 함수
    setIsFavoriteColor(
      await filterFavoriteReturnStarColor(latitude, longitude),
    );
    //검색기록 필터
    await handleFilterData(
      id,
      location,
      address,
      longitude,
      latitude,
      'search',
      searchedList,
    );
  };

  const _handlePlacesAPI = async (text) => {
    try {
      let data;
      const response = await fetch(`${KAKAO_API_URL}?query=${text}`, {
        headers: {
          Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
        },
      });

      data = await response.json();
      if (data.errorType) {
        errorNotifAlert(`Error ${data.message}`);
        return;
      }

      getCandidate(data.documents);
      //setSearchedList(candidate);
      setCandidate(candidate);
      if (candidate.length === 0) {
        noDataAlert();
        return;
      }
      return candidate;
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
        searchedList={
          candidateState.length !== 0 ? candidateState : searchedList
        }
        setSearchedList={
          candidateState.length !== 0 ? setCandidate : setSearchedList
        }
        isFavoriteColor={isFavoriteColor}
        handleFavorite={() => handleFavorite(locationData, setIsFavoriteColor)}
        touchLocationData={(locationData) => touchLocationData(locationData)}
        type={type}
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
