import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ImageBackground,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { setTabBar } from 'redux/store';

import IconHome from '#assets/icons/icon-home';
import IconHandleStart from '#assets/icons/icon-handle-start';

import { getCurrentTime } from 'utils/Time';
import { getDataFromAsync } from 'utils/AsyncStorage';
import { geofenceUpdate } from 'utils/BgGeofence';
import {
  restartNotifAlert,
  restartDenyAlert,
  startDenyAlert,
  startAlert,
} from 'utils/TwoButtonAlert';
import { checkGeofenceSchedule } from 'utils/GeofenceScheduler';
import { cancelNotification } from 'utils/Notification';

import {
  KEY_VALUE_GEOFENCE,
  KEY_VALUE_DAY_CHANGE,
  SCREEN_WIDTH,
} from 'constant/const';

const handleRestart = async () => {
  try {
    // 지오펜스 일정 중 트래킹이 안된 일정이 있는 경우 현재 시간과 가장 가까운 일정으로 넘어간다.
    const isNeedRestart = await checkGeofenceSchedule();
    const geofenceData = await getDataFromAsync(KEY_VALUE_GEOFENCE);
    const currentTime = getCurrentTime();
    let idx = 0;

    const restartAlert = () =>
      Alert.alert(
        '다시 시작',
        '다시 치열한 하루를 보낼 준비됐나요?',
        [
          { text: '취소' },
          {
            text: '확인',
            onPress: async () => {
              try {
                if (geofenceData.length == 1) {
                  // 현재 일정이 마지막일 때
                  await geofenceUpdate(geofenceData);
                  restartNotifAlert();
                } else {
                  for (const data of geofenceData) {
                    if (data.finishTime > currentTime) {
                      break;
                    }
                    cancelNotification(data.id); // 넘어간 일정들에 예약된 알림 모두 취소
                    idx += 1;
                  }
                  if (geofenceData.length === idx) {
                    // 현재시간과 가장 가까운 다음 일정이 없을 때
                    restartNotifAlert();
                  } else {
                    console.log('넘어간 일정 객체 : ', geofenceData[idx]);
                    restartNotifAlert(geofenceData[idx].startTime);
                  }
                  await geofenceUpdate(geofenceData, idx);
                }
              } catch (e) {
                console.log('startAlert Error : ', e);
              }
            },
          },
        ],
        { cancelable: false },
      );

    if (isNeedRestart) {
      restartAlert();
    } else {
      restartDenyAlert();
    }
  } catch (e) {
    console.log('handleRestart Error :', e);
  }
};

const handleStart = async () => {
  try {
    const isDayChange = await getDataFromAsync(KEY_VALUE_DAY_CHANGE);
    if (isDayChange) {
      const geofenceData = await getDataFromAsync(KEY_VALUE_GEOFENCE);
      if (geofenceData === null) {
        startDenyAlert(1);
      } else {
        startAlert(geofenceUpdate, geofenceData);
      }
    } else {
      startDenyAlert(2);
    }
  } catch (e) {
    console.log('handleStart Error : ', e);
  }
};

const TabBar = (props) => {
  const { state, descriptors, navigation } = props;
  const visibleName = useSelector((state) => state.tabBar);
  const network = useSelector((state) => state.network);
  const dispatch = useDispatch();
  return (
    <View style={styles.wrap}>
      <View style={styles.tabContainer}>
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            let label = options.tabBarLabel;

            const onLongPress = () => {
              if (visibleName === 'today') {
                dispatch(setTabBar('yesterday'));
                navigation.navigate('yesterday');
              } else {
                dispatch(setTabBar('today'));
                navigation.navigate('today');
              }
            };
            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                targt: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defulatPrevented) {
                navigation.navigate(route.name);
              }
            };

            if (route.name === 'today' || route.name === 'yesterday') {
              return (
                <TouchableOpacity
                  isFocused={isFocused}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  key={`tab_${index}`}
                  style={{ marginRight: 30 }}
                >
                  <Text
                    style={[
                      styles.tabBarText,
                      { color: isFocused ? '#229892' : '#ADADAD' },
                    ]}
                    isFocused={isFocused}
                  >
                    {label}
                  </Text>
                  {isFocused ? <View style={styles.tabUnderBar} /> : null}
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                isFocused={isFocused}
                onPress={onPress}
                key={`tab_${index}`}
              >
                <Text
                  style={[
                    styles.tabBarText,
                    { color: isFocused ? '#229892' : '#ADADAD' },
                  ]}
                  isFocused={isFocused}
                >
                  {label}
                </Text>
                {isFocused ? <View style={styles.tabUnderBar} /> : null}
              </TouchableOpacity>
            );
          })}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: network === 'online' ? 'space-between' : 'flex-end',
            alignItems: 'flex-start',
            width: 120,
            //backgroundColor: 'green',
          }}
        >
          {network === 'online' ? (
            <>
              <TouchableOpacity
                onPress={() => network === 'online' && handleStart()}
                style={{ marginTop: 6 }}
              >
                <IconHandleStart
                  style={styles.navIcon}
                  name="icon-handle-reset"
                  size={21}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginTop: 5 }}
                onPress={() => network === 'online' && handleRestart()}
              >
                <ImageBackground
                  style={[{ width: 22, height: 22 }]}
                  source={{ uri: 'iconHandleStart' }}
                />
              </TouchableOpacity>
            </>
          ) : null}
          <TouchableOpacity
            style={{ marginTop: 5 }}
            onPress={() =>
              network === 'online'
                ? navigation.navigate('Home', { screen: 'Home' })
                : navigation.navigate('OffHome', { screen: 'OffHome' })
            }
          >
            <IconHome name="icon-home" size={22} style={styles.navIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: SCREEN_WIDTH,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  tabContainer: {
    width: '100%',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  tabUnderBar: {
    backgroundColor: '#229892',
    width: 50,
    height: 3,
    position: 'absolute',
    bottom: -10,
    right: -5,
  },
  tabBarText: {
    fontFamily: 'GodoB',
    fontSize: 22,
    fontWeight: 'bold',
  },
  navIcon: { color: '#717171', width: 30, height: 30 },
});

export default TabBar;
