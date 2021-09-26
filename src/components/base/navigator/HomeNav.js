import React, { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { createStackNavigator } from '@react-navigation/stack';

import Home from 'components/screen/Home';
import OffHome from 'components/screen/OffHome';
import { ModalStack } from 'components/base/navigator/Stack';
import { SchedullScreenDetail } from 'components/base/navigator/ScheduleScreenDetail';
import { Loading } from 'components/screen/Loading';

import { offlineAlert } from 'utils/TwoButtonAlert';

export const Stack = createStackNavigator();

const HomeStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen
        name="ScheduleToday"
        navigation={navigation}
        component={SchedullScreenDetail}
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
        component={SchedullScreenDetail}
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
        offlineAlert();
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
        swipeEnabled: false,
      }}
    >
      {network === 'online' ? (
        <Stack.Screen name="Home" component={HomeStack} />
      ) : (
        <Stack.Screen name="OffHome" component={OffHomeStack} />
      )}
      <Stack.Screen name="ModalStack" component={ModalStack} />
    </Stack.Navigator>
  ) : (
    <Loading />
  );
};

export default HomeNav;
