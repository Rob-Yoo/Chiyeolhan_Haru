import React, { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import store from 'redux/store';

import HomeNav from 'components/base/navigator/HomeNav';

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  const prepare = async () => {
    try {
      await SplashScreen.preventAutoHideAsync();
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
