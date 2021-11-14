import React, { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { createStackNavigator } from '@react-navigation/stack';

import Home from 'components/screen/HomeScreen';
import OffHome from 'components/screen/OffHomeScreen';
import { ScheduleDetail } from 'components/base/navigator/ScheduleDetailNav';
import { Loading } from 'components/screen/LoadingScreen';

export const Stack = createStackNavigator();

const config = {
  animation: 'timing',
  config: {
    duration: 500,
  },
};

const HomeStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen
        name="ScheduleToday"
        navigation={navigation}
        component={ScheduleDetail}
        options={{
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
      />
    </Stack.Navigator>
  );
};

const OffHomeStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="OffHome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="OffHome" component={OffHome} />
      <Stack.Screen
        name="ScheduleToday"
        navigation={navigation}
        component={ScheduleDetail}
      />
    </Stack.Navigator>
  );
};

const HomeNav = ({ navigation }) => {
  const [network, setNetwork] = useState('online');
  const [isNetwork, setIsNetwork] = useState(false);

  useEffect(() => {
    checkNetwork();
  }, [network]);

  const checkNetwork = () => {
    NetInfo.addEventListener(async (state) => {
      if (state.isInternetReachable !== null) {
        if (state.isInternetReachable && state.isConnected) {
          await _handleIsConnected();
          setIsNetwork(true);
        } else if (!state.isInternetReachable && !state.isConnected) {
          await _handleIsNotConnected();
          setIsNetwork(true);
        }
      }
    });
  };

  const _handleIsConnected = async () => {
    try {
      if (network === 'offline') {
        setNetwork('online');
      }
      console.log('Online');
    } catch (e) {
      console.log('_handleIsConnected Error :', e);
    }
  };

  const _handleIsNotConnected = async () => {
    try {
      if (network === 'online') {
        setNetwork('offline');
        console.log('Offline');
      }
    } catch (e) {
      console.log('_handleIsNotConnected Error :', e);
    }
  };

  return isNetwork ? (
    <Stack.Navigator
      mode="modal"
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitle: false,
        headerShown: false,
      }}
    >
      {network === 'online' ? (
        <Stack.Screen name="Home" component={HomeStack} />
      ) : (
        <Stack.Screen name="OffHome" component={OffHomeStack} />
      )}
    </Stack.Navigator>
  ) : (
    <Loading />
  );
};

export default HomeNav;
