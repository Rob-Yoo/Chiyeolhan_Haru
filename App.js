import React, { useEffect, useState, useRef } from 'react';
import { AppState } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import store from 'redux/store';

import HomeNav from 'components/base/navigator/HomeNav';

import { initBgGeofence, subscribeOnGeofence } from 'utils/BgGeofence';

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  // const [isTerminate, setIsTerminate] = useState(false);
  // const appState = useRef(AppState.currentState);

  // const _handleAppStateChange = async (nextAppState) => {
  //   if (
  //     appState.current.match(/inactive|background/) &&
  //     nextAppState === 'active'
  //   ) {
  //     setIsTerminate(false);
  //   }

  //   appState.current = nextAppState;
  // };

  const prepare = async () => {
    try {
      await SplashScreen.preventAutoHideAsync();
      subscribeOnGeofence();
      await initBgGeofence();
      // const result = await initBgGeofence();
      // setIsTerminate(result);
      // console.log(result);
    } catch (e) {
      console.warn(e);
      // await SplashScreen.hideAsync();
    } finally {
      setAppIsReady(true);
      // await SplashScreen.hideAsync();
    }
  };

  useEffect(() => {
    // AppState.addEventListener('change', _handleAppStateChange);
    prepare();
    // return () => {
    //   AppState.removeEventListener('change', _handleAppStateChange);
    // };
  }, []);

  return (
    <>
      {appIsReady && (
        <>
          <Provider store={store}>
            <NavigationContainer>
              <HomeNav />
            </NavigationContainer>
          </Provider>
        </>
      )}
    </>
  );
};

export default App;
