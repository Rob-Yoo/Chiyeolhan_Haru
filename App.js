<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import toDos from "./redux/store";
import * as SplashScreen from "expo-splash-screen";
import HomeNav from "./navigator/HomeNav";
import { Provider } from "react-redux";
import { fetchToDo } from "./redux/fetchData";
import { initBgGeofence } from "./BgGeofence";
=======
import React, { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import toDos from './redux/store';
import * as SplashScreen from 'expo-splash-screen';
import HomeNav from './navigator/HomeNav';
import { Provider } from 'react-redux';
>>>>>>> b4da4d89d25af6db279d7b2f1ff34d271f921149

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        //keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
<<<<<<< HEAD
        fetchToDo();
        initBgGeofence();
=======

>>>>>>> b4da4d89d25af6db279d7b2f1ff34d271f921149
        //Pre-load fonts, make any API calls you need to do here
      } catch (e) {
        console.warn(e);
      } finally {
        //Tell ther application to render

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
