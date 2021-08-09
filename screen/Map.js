import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  AppState,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { GOOGLE_PLACES_API_KEY } from '@env';

import IconGobackButton from '../assets/icons/icon-go-back-button';
import IconFavoriteBefore from '../assets/icons/icon-favorite';
const URL = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json';
const PARAMS =
  'inputtype=textquery&language=ko&fields=formatted_address,name,geometry';

const CurrentMap = ({ location, navigation, route }) => {
  const [inputText, setText] = useState('');
  const [isRenderData, setRenderData] = useState(false);
  const [locationDatas, setDatas] = useState({});
  const [locationResult, setResult] = useState(location);
  const addToDoLocation = () => {
    navigation.navigate('TodoModal', { locationDatas });
  };
  const locationStyles = StyleSheet.create({
    locationDataSection: {
      flex: 1,
      alignItems: 'center',
      position: 'absolute',
      left: 30,
      bottom: 30,
    },
    locationInfoCard: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      maxWidth: 350,
      width: 350,
      height: 130,
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 10,
    },
    locationTitle: {
      fontFamily: 'NotoSansKR-Bold',
      fontSize: 20,
      color: '#000000',
      marginBottom: 15,
    },
    locationText: {
      color: '#000000BA',
    },
    roadName: {
      fontFamily: 'NotoSansKR-Regular',
      color: '#C4C4C4',
      width: 50,
      borderWidth: 2,
      borderColor: '#C4C4C4',
      marginRight: 4,
    },
    locationFinButton: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: 80,
      height: 50,
      borderRadius: 10,
      backgroundColor: '#54BCB6',
    },
    locationFinText: {
      fontFamily: 'NotoSansKR-Bold',
      fontSize: 20,
      color: '#FFFFFF',
    },
  });

  const LocationData = () => {
    return (
      <View style={locationStyles.locationInfoCard}>
        <View style={{ flex: 4 }}>
          <Text style={locationStyles.locationTitle}>{locationDatas.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={locationStyles.roadName}>도로명</Text>
            <Text style={locationStyles.locationText}>
              {locationDatas.location}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={locationStyles.locationFinButton}
          onPress={addToDoLocation}
        >
          <Text style={locationStyles.locationFinText}>완료</Text>
        </TouchableOpacity>
      </View>
    );
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
      { cancelable: false }
    );
  const _handlePlacesAPI = (text) => {
    setRenderData(true);
    const place = text.replaceAll(' ', '%20');
    fetch(`${URL}?input=${place}&${PARAMS}&key=${GOOGLE_PLACES_API_KEY}`)
      .then((response) => response.json())
      .then((data) => {
        const {
          candidates: [
            {
              formatted_address: location,
              geometry: {
                location: { lat: latitude, lng: longitude },
              },
              name,
            },
          ],
          status,
        } = data;
        setDatas({ location, latitude, longitude, name, status });
        switch (status) {
          case 'OK':
            const result = data.candidates[0].geometry;
            setResult({
              latitude: result.location.lat,
              longitude: result.location.lng,
            });
            break;
          case 'ZERO_RESULTS':
            createTwoButtonAlert();
            break;
          case 'OVER_QUERY_LIMIT':
            console.log('API 할당량 넘었음');
            break;
          default:
            console.log('Error');
        }
      });
  };
  useEffect(() => {}, [locationResult]);
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
          <View style={locationStyles.locationDataSection}>
            <LocationData />
          </View>
        ) : null}
      </MapView>
    </View>
  );
};

const Map = ({ navigation }) => {
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
    <CurrentMap navigation={navigation} location={location} />
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
