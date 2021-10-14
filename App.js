import React, { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-community/async-storage';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import store from 'redux/store';

import HomeNav from 'components/base/navigator/HomeNav';

import { getDataFromAsync, dbToAsyncStorage } from 'utils/AsyncStorage';

import {
  KEY_VALUE_INSTALLED,
  KEY_VALUE_PROGRESSING,
  KEY_VALUE_GEOFENCE,
} from 'constant/const';

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  const loadSavedData = async () => {
    try {
      const installed = await getDataFromAsync(KEY_VALUE_INSTALLED);

      if (!installed) {
        await dbToAsyncStorage();
        const progressing = await getDataFromAsync(KEY_VALUE_PROGRESSING);
        const geofenceData = await getDataFromAsync(KEY_VALUE_GEOFENCE);
        if (progressing) {
          geofenceData.unshift(progressing);
          await AsyncStorage.setItem(
            KEY_VALUE_GEOFENCE,
            JSON.stringify(geofenceData),
          );
        }
        if (geofenceData.length === 0) {
          await AsyncStorage.removeItem(KEY_VALUE_GEOFENCE);
        }
        console.log('loaded GeofenceData : ', geofenceData);
        await AsyncStorage.setItem(KEY_VALUE_INSTALLED, 'true');
      }
    } catch (e) {
      console.log('loadSavedData Error : ', e);
    }
  };

  const prepare = async () => {
    try {
      await SplashScreen.preventAutoHideAsync();
      await loadSavedData();
    } catch (e) {
      console.warn(e);
      await SplashScreen.hideAsync();
    } finally {
      setAppIsReady(true);
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
