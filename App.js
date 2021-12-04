import React, { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import store from 'redux/store';

import HomeNav from 'components/base/navigator/HomeNav';

import { loadSavedData } from 'utils/asyncStorageUtil';
import { initBgGeofence } from 'utils/bgGeofenceUtil';

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  const prepare = async () => {
    try {
      const isBackground = await initBgGeofence();
      if (!isBackground) {
        await SplashScreen.preventAutoHideAsync();
      }
      await loadSavedData();
      setAppIsReady(true);
    } catch (e) {
      console.warn(e);
      await SplashScreen.hideAsync();
    }
  };

  useEffect(() => {
    prepare();
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
