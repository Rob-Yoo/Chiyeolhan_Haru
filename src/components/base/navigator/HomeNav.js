import React, { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import Home from 'components/screen/Home';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { ModalStack } from 'components/base/navigator/Stack';
import { SchedullScreenDetail } from 'components/base/navigator/ScheduleScreenDetail';
import { KEY_VALUE_OFFLINE } from 'constant/const';
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

const HomeNav = ({ navigation }) => {
  const [network, setNetwork] = useState('online');

  useEffect(() => {
    checkNetwork();
  }, [network]);

  const checkNetwork = () => {
    NetInfo.addEventListener(async (state) => {
      if (state.isInternetReachable !== null) {
        if (state.isInternetReachable && state.isConnected) {
          await _handleIsConnected(state);
        } else if (!state.isInternetReachable && !state.isConnected) {
          await _handleIsNotConnected();
        }
      }
    });
  };

  const _handleIsConnected = async (state) => {
    try {
      if (network === 'offline') {
        setNetwork('online');
      }
      console.log('Online');
      await AsyncStorage.removeItem(KEY_VALUE_OFFLINE);
    } catch (e) {
      console.log('_handleIsConnected Error :', e);
    }
  };

  const _handleIsNotConnected = async () => {
    try {
      if (network === 'online') {
        offlineAlert();
        await AsyncStorage.setItem(KEY_VALUE_OFFLINE, 'Offline');
        const a = await AsyncStorage.getItem(KEY_VALUE_OFFLINE);
        console.log(a);
        setNetwork('offline');
      }
    } catch (e) {
      console.log('_handleIsNotConnected Error :', e);
    }
  };

  return (
    <Stack.Navigator
      mode="modal"
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitle: false,
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeStack} />
      <Stack.Screen name="ModalStack" component={ModalStack} />
    </Stack.Navigator>
  );
};

export default HomeNav;
