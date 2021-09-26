import React, { useEffect, useState, useRef } from 'react';
import { AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import HomeNav from 'components/base/navigator/HomeNav';
import { Provider } from 'react-redux';
import { initBgGeofence, subscribeOnGeofence } from 'utils/BgGeofence';
import BackgroundGeolocation from 'react-native-background-geolocation';
import store from 'redux/store';

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

  const prepare = async () => {
    try {
      await SplashScreen.preventAutoHideAsync();
      subscribeOnGeofence();
      const result = await initBgGeofence();
      setIsTerminate(result);
    } catch (e) {
      console.warn(e);
      await SplashScreen.hideAsync();
    } finally {
      setAppIsReady(true);
      await SplashScreen.hideAsync();
    }
  };

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);
    prepare();
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
