import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { dbService } from 'utils/firebase';
import Home from 'components/screen/Home';
import OffHome from 'components/screen/OffHome';
import { ModalStack } from 'components/base/navigator/Stack';
import { SchedullScreenDetail } from 'components/base/navigator/ScheduleScreenDetail';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { KEY_VALUE_OFFLINE, KEY_VALUE_SUCCESS, UID } from 'constant/const';
import { getDataFromAsync } from 'utils/AsyncStorage';
import { offlineAlert } from 'utils/TwoButtonAlert';
import { getCurrentTime } from 'utils/Time';
import { Loading } from '../../screen/Loading';

export const Stack = createStackNavigator();

const HomeStack = ({ navigation }) => {
  const loadSuccessSchedules = async () => {
    try {
      const successSchedules = await getDataFromAsync(KEY_VALUE_SUCCESS);
      const currentTime = getCurrentTime();
      const todosRef = dbService.collection(`${UID}`);
      //   const toDoRef = dbService.collection(`${UID}`).doc(`${data[0].id}`);
      //   await toDoRef.update({ isDone: true });
      if (successSchedules !== null) {
        for (const schedule of successSchedules) {
          if (schedule.startTime <= currentTime) {
            await todosRef.doc(`${schedule.id}`).update({ isDone: true });
          }
        }
      }
    } catch (e) {
      console.log('loadSuccessSchedules Error :', e);
    }
  };
  useEffect(() => {
    loadSuccessSchedules();
  }, []);
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
