import React, { useEffect, useState, useRef } from 'react';
import { AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import HomeNav from 'components/base/navigator/HomeNav';
import { Provider } from 'react-redux';
import { initBgGeofence } from 'utils/BgGeofence';
import BackgroundGeolocation from 'react-native-background-geolocation';
import store from 'redux/store';
import { SafeAreaView } from 'react-navigation';

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
      const result = await initBgGeofence();
      console.log(result);
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
              <SafeAreaView style={{ flex: 1 }}>
                <HomeNav />
              </SafeAreaView>
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
