import React, { useEffect, useState, useRef } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
//import toDosSlice from 'redux/store';
import * as SplashScreen from 'expo-splash-screen';
import HomeNav from 'components/base/navigator/HomeNav';
import { Provider } from 'react-redux';
import { initBgGeofence } from 'utils/BgGeofence';
import BackgroundGeolocation from 'react-native-background-geolocation';
import store from 'redux/store';
import { KEY_VALUE_GEOFENCE } from 'constant/const';

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [isTerminate, setIsTerminate] = useState(false);
  const appState = useRef(AppState.currentState);

  const _handleAppStateChange = async (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      setIsTerminate(false);
      try {
        await BackgroundGeolocation.requestPermission();
        console.log('success');
      } catch (e) {
        console.log('requestPermission Deny:', e);
      }
    }

    appState.current = nextAppState;
  };

  useEffect(() => {
    const prepare = async () => {
      try {
        let data = await AsyncStorage.getItem(KEY_VALUE_GEOFENCE);
        if (data !== null) {
          data = JSON.parse(data);
        }
        await SplashScreen.preventAutoHideAsync();
        const result = await initBgGeofence(data);
        setIsTerminate(result);
      } catch (e) {
        console.warn(e);
        await SplashScreen.hideAsync();
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    };
    prepare();
    AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  return (
    <>
      {!isTerminate && appIsReady ? (
        <>
          {console.log('foreground')}
          <Provider store={store}>
            <NavigationContainer>
              <HomeNav />
            </NavigationContainer>
          </Provider>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default App;
