import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
//import toDosSlice from 'redux/store';
import * as SplashScreen from 'expo-splash-screen';
import HomeNav from 'components/base/navigator/HomeNav';
import { Provider } from 'react-redux';
import { initBgGeofence, geofenceUpdate } from 'utils/BgGeofence';
import store from 'redux/store';

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        //keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        await initBgGeofence();
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
      <Provider store={store}>
        <NavigationContainer>
          <HomeNav />
        </NavigationContainer>
      </Provider>
    </>
  );
}
