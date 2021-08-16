import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import toDos from "redux/store";
import BackgroundGeolocation from "react-native-background-geolocation";
import * as SplashScreen from "expo-splash-screen";
import HomeNav from "components/base/navigator/HomeNav";
import { Provider } from "react-redux";
import AsyncStorage from "@react-native-community/async-storage";
import { KEY_VALUE2 } from "constant/const";
import { initBgGeofence, geofenceUpdate } from "utils/BgGeofence";

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        //keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        await initBgGeofence();
        BackgroundGeolocation.onGeofence(async (event) => {
          // console.log("Tracking Start");
          console.log(event.action);
          try {
            const data = await AsyncStorage.getItem(KEY_VALUE2);
            const time = new Date();
            const hour =
              time.getHours() < 10 ? `0${time.getHours()}` : time.getHours();
            const min =
              time.getMinutes() < 10
                ? `0${time.getMinutes()}`
                : time.getMinutes();
            const timeString = `${hour}:${min}`;
            if (JSON.parse(data)[0].startTime == timeString) {
              geofenceUpdate(data);
            }
          } catch (error) {
            console.log("[get geofence data] :" + error);
          }
        });
        //Pre-load fonts, make any API calls you need to do here
      } catch (e) {
        console.warn(e);
      } finally {
        //Tell ther application to render});
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);
  if (!appIsReady) {
    return null;
  }
  return (
    <>
      <Provider store={toDos}>
        <NavigationContainer>
          <HomeNav />
        </NavigationContainer>
      </Provider>
    </>
  );
}
