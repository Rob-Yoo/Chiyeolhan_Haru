import React, { useEffect, useState, useRef } from 'react';
import { AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
//import toDosSlice from 'redux/store';
import * as SplashScreen from 'expo-splash-screen';
import HomeNav from 'components/base/navigator/HomeNav';
import { Provider } from 'react-redux';
import { initBgGeofence } from 'utils/BgGeofence';
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
        const status = await BackgroundGeolocation.requestPermission();
        console.log('success');
      } catch (e) {
        console.log('requestPermission Deny in App component :', e);
      }
    }

    appState.current = nextAppState;
  };

  useEffect(() => {
    const prepare = async () => {
      try {
        //keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        const result = await initBgGeofence();
        setIsTerminate(result);
        //Pre-load fonts, make any API calls you need to do here
      } catch (e) {
        console.warn(e);
      } finally {
        //Tell ther application to render});
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
