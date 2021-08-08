import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  AppState,
  TextInput,
  Alert,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { GOOGLE_PLACES_API_KEY } from "@env";

const URL = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";
const PARAMS =
  "inputtype=textquery&language=ko&fields=formatted_address,name,geometry";

const CurrentMap = ({ location }) => {
  const [inputText, setText] = useState("");
  const [locationResult, setResult] = useState(location);
  const createTwoButtonAlert = () =>
    Alert.alert(
      "검색 결과가 없습니다.",
      "",
      [
        {
          text: "취소",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "확인", onPress: () => console.log("OK Pressed") },
      ],
      { cancelable: false }
    );
  const _handlePlacesAPI = (text) => {
    const place = text.replaceAll(" ", "%20");
    fetch(`${URL}?input=${place}&${PARAMS}&key=${GOOGLE_PLACES_API_KEY}`)
      .then((response) => response.json())
      .then((data) => {
        const status = data.status;
        switch (status) {
          case "OK":
            const result = data.candidates[0].geometry;
            setResult({
              latitude: result.location.lat,
              longitude: result.location.lng,
            });
            break;
          case "ZERO_RESULTS":
            createTwoButtonAlert();
            break;
          case "OVER_QUERY_LIMIT":
            console.log("API 할당량 넘었음");
            break;
          default:
            console.log("Error");
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
            position: "absolute",
            top: 50,
            left: 50,
            width: 200,
            height: 200,
          }}
        >
          <TextInput
            style={{
              backgroundColor: "white",
            }}
            placeholder="장소, 버스, 지하철, 주소 검색"
            onChangeText={(text) => setText(text)}
            onSubmitEditing={() => _handlePlacesAPI(inputText)}
          ></TextInput>
        </View>
        <Marker
          coordinate={{
            latitude: locationResult.latitude,
            longitude: locationResult.longitude,
          }}
        />
      </MapView>
    </View>
  );
};

const Map = () => {
  const appState = useRef(AppState.currentState);
  const [stateVisible, setStateVisible] = useState(appState.current);
  const [isFind, setFind] = useState(false);
  const [location, setLocation] = useState({});

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      getLocation();
    }

    appState.current = nextAppState;
    setStateVisible(appState.current);
  };
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
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
    AppState.addEventListener("change", _handleAppStateChange);
    getLocation();
    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);
  return isFind ? <CurrentMap location={location} /> : <Text>Loading...</Text>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default Map;
