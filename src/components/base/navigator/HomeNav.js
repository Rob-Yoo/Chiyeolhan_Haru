import React, { useEffect } from 'react';
import Home from 'components/screen/Home';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { ModalStack } from 'components/base/navigator/Stack';
import { SchedullScreenDetail } from 'components/base/navigator/ScheduleScreenDetail';
import {
  KEY_VALUE_GEOFENCE,
  KEY_VALUE_TODAY_DATA,
  KEY_VALUE_TODAY,
  KEY_VALUE_TOMORROW_DATA,
  TODAY,
} from 'constant/const';
import { geofenceUpdate } from 'utils/BgGeofence';
import { getCurrentTime } from 'utils/Time';

export const Stack = createStackNavigator();
//export const navOptionHandler = { headerShown: false };

const detectTodayChange = async () => {
  try {
    const today = await AsyncStorage.getItem(KEY_VALUE_TODAY);
    const tomorrowData = await AsyncStorage.getItem(KEY_VALUE_TOMORROW_DATA);

    if (today === null) {
      await AsyncStorage.setItem(KEY_VALUE_TODAY, TODAY); // TODAY 어싱크에 바뀐 오늘날짜를 저장
    } else if (today !== TODAY) {
      // 오늘이 지나면
      await AsyncStorage.setItem(KEY_VALUE_TODAY, TODAY); // TODAY 어싱크에 바뀐 오늘날짜를 저장
      // TOMORROW 데이터들을 각각 TODAY_DATA, GEOFENCE 어싱크 스토리지에 넣어놓고 비워둠.
      await AsyncStorage.setItem(KEY_VALUE_TODAY_DATA, tomorrowData);
      await AsyncStorage.setItem(KEY_VALUE_GEOFENCE, tomorrowData);
      await AsyncStorage.removeItem(KEY_VALUE_TOMORROW_DATA);

      const geofenceData = await AsyncStorage.getItem(KEY_VALUE_GEOFENCE);
      await geofenceUpdate(geofenceData, false, 0);
      console.log('바뀐 geofenceData :', geofenceData);
    } else {
      console.log('날짜가 바뀌지 않았음');
    }
  } catch (e) {
    console.log('detectTodayChange Error :', e);
  }
};

const detectExactGeofenceSchedule = async () => {
  const currentTime = getCurrentTime();
};

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
  useEffect(() => {
    detectTodayChange();
  }, []);
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
