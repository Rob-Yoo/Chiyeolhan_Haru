import React, { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator } from '@react-navigation/stack';

import Home from 'components/screen/Home';
import OffHome from 'components/screen/OffHome';
import { ModalStack } from 'components/base/navigator/Stack';
import { SchedullScreenDetail } from 'components/base/navigator/ScheduleScreenDetail';
import { Loading } from 'components/screen/Loading';

import { dbService } from 'utils/firebase';
import { getDataFromAsync, checkTodayChange } from 'utils/AsyncStorage';
import { offlineAlert } from 'utils/TwoButtonAlert';
import { getCurrentTime } from 'utils/Time';

import { KEY_VALUE_SUCCESS, UID } from 'constant/const';

export const Stack = createStackNavigator();

const HomeStack = ({ navigation }) => {
  const loadSuccessSchedules = async () => {
    try {
      let successSchedules = await getDataFromAsync(KEY_VALUE_SUCCESS);
      let isNeedUpdate = false;
      const currentTime = getCurrentTime();
      const todosRef = dbService.collection(`${UID}`);
      if (successSchedules !== null) {
        for (const schedule of successSchedules) {
          if (schedule.startTime <= currentTime) {
            await todosRef.doc(`${schedule.id}`).update({ isDone: true });
          }
          if (schedule.finishTime < currentTime) {
            successSchedules = successSchedules.filter(
              (success) => success.id !== schedule.id,
            ); // 이미 끝난 성공한 일정은 삭제
            isNeedUpdate = true;
          }
        }
        if (isNeedUpdate) {
          await AsyncStorage.setItem(
            KEY_VALUE_SUCCESS,
            JSON.stringify(successSchedules),
          );
          console.log('끝난 성공한 일정 사라짐: ', successSchedules);
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
    checkTodayChange();
  }, []);

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
