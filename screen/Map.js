import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Alert,
  Linking,
  Platform,
  Text,
  AppState,
  Button,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as Location from "expo-location";

const CurrentMap = ({ location }) => {
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

  const openAppSettings = () => {
    if (Platform.OS === "ios") {
      Linking.openSettings();
    } // android 일 때 생각해줘야함
  };
  const createTwoButtonAlert = () =>
    Alert.alert(
      "위치정보 이용 제한",
      "설정에서 위치정보 이용에 대한 액세스 권한을 허용해주세요.",
      [
        {
          text: "취소",
          style: "cancel",
        },
        { text: "설정", onPress: () => openAppSettings() },
      ],
      { cancelable: false }
    );
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
      createTwoButtonAlert();
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
