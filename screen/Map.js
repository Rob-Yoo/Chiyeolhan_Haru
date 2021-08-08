import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  AppState,
  TextInput,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { initBgGeofence } from "../BgGeofence";
import { GOOGLE_PLACES_API_KEY } from "@env";

const url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";
const params =
  "inputtype=textquery&language=ko&fields=formatted_address,name,geometry";

const CurrentMap = ({ location }) => {
  const [inputText, setText] = useState("");
  const _handlePlaceAPI = (text) => {
    const place = text.replaceAll(" ", "%20");
    fetch(`${url}?input=${place}&${params}&key=${GOOGLE_PLACES_API_KEY}`)
      .then((response) => response.json())
      .then((data) => console.log(data));
  };
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={{
          ...location,
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
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
            onSubmitEditing={() => _handlePlaceAPI(inputText)}
          ></TextInput>
        </View>
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
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
      initBgGeofence();
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
