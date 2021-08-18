import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  AppState,
  TextInput,
  Alert,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Modal from 'react-native-modal';

import IconGobackButton from '#assets/icons/icon-go-back-button';
import IconFavoriteBefore from '#assets/icons/icon-favorite';

import { GOOGLE_PLACES_API_KEY } from '@env';
import { PLACES_PARAMS } from 'constant/const';
import { GOOGLE_API_URL } from 'constant/const';
import { LocationData } from 'components/items/LocationData';

const CurrentMap = ({ location, navigation, routeName }) => {
  const [inputText, setText] = useState('');
  const [isRenderData, setRenderData] = useState(false);
  const [locationData, setData] = useState({});
  const [locationResult, setResult] = useState(location);

  useEffect(() => {}, [locationResult]);

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
    const place = text.replaceAll(' ', '%20');
    fetch(
      `${GOOGLE_API_URL}?input=${place}&${PLACES_PARAMS}&key=${GOOGLE_PLACES_API_KEY}`,
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
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              height: 130,
              backgroundColor: '#54BCB6',
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              paddingTop: 50,
            }}
          >
            <IconGobackButton
              name="icon-go-back-button"
              size={20}
              style={{ width: 30, height: 30 }}
              onPress={() => navigation.goBack()}
            />

            <TextInput
              style={{
                backgroundColor: '#fff',
                flex: 0.8,
                height: 50,
                borderRadius: 10,
              }}
              placeholder=" 장소, 버스, 지하철, 주소 검색"
              onChangeText={(text) => setText(text)}
              onSubmitEditing={() => _handlePlacesAPI(inputText)}
            ></TextInput>
            <IconFavoriteBefore
              name="icon-favorite"
              size={25}
              style={{ position: 'absolute', right: 40, bottom: 30 }}
            />
          </View>
        </View>
        <Marker
          coordinate={{
            latitude: locationResult.latitude,
            longitude: locationResult.longitude,
          }}
        />
        {isRenderData ? (
          <LocationData
            locationData={locationData}
            navigation={navigation}
            routeName={routeName}
          />
        ) : null}
      </MapView>
    </View>
  );
};

const Map = ({ navigation, route }) => {
  const appState = useRef(AppState.currentState);

  const [stateVisible, setStateVisible] = useState(appState.current);
  const [isFind, setFind] = useState(false);
  const [location, setLocation] = useState({});
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
  };
  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);
    getLocation();
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);
  return isFind ? (
    <CurrentMap
      navigation={navigation}
      location={location}
      routeName={route.params.routeName}
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
