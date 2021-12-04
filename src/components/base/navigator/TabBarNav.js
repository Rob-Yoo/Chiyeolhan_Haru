import React from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  ImageBackground,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import PushNotification from 'react-native-push-notification';

import { setTabBar, skip } from 'redux/store';

import { scrollRefresh } from 'components/items/ScheduleComponent';

import IconHome from '#assets/icons/icon-home';
import IconHandleStart from '#assets/icons/icon-handle-start';

import { fontPercentage } from 'utils/responsiveUtil';
import { getCurrentTime } from 'utils/timeUtil';
import { dbService } from 'utils/firebaseUtil';
import { checkDayChange, getDataFromAsync } from 'utils/asyncStorageUtil';
import { geofenceUpdate } from 'utils/bgGeofenceUtil';
import {
  skipNotifAlert,
  skipDenyAlert,
  startDenyAlert,
  startAlert,
  errorNotifAlert,
} from 'utils/buttonAlertUtil';
import { checkGeofenceSchedule } from 'utils/gfSchedulerUtil';
import { cancelAllNotif } from 'utils/notificationUtil';

import {
  UID,
  KEY_VALUE_GEOFENCE,
  KEY_VALUE_DAY_CHANGE,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  CONTAINER_WIDTH,
} from 'constant/const';

const handleSkip = async (isNeedSkip) => {
  try {
    // 지오펜스 일정 중 트래킹이 안된 일정이 있는 경우 현재 시간과 가장 가까운 일정으로 넘어간다.
    const geofenceData = await getDataFromAsync(KEY_VALUE_GEOFENCE);
    const currentTime = getCurrentTime();
    let idx = 0;

    const skip = async () => {
      try {
        if (geofenceData.length == 1) {
          // 현재 일정이 마지막일 때
          await geofenceUpdate(geofenceData);
          skipNotifAlert();
        } else {
          for (const data of geofenceData) {
            if (data.finishTime > currentTime) {
              break;
            }
            cancelAllNotif(data.id); // 넘어간 일정들에 예약된 알림 모두 취소
            idx += 1;
          }
          if (geofenceData.length === idx) {
            // 현재시간과 가장 가까운 다음 일정이 없을 때
            skipNotifAlert();
          } else {
            // console.log('넘어간 일정 객체 : ', geofenceData[idx]);
            skipNotifAlert(geofenceData[idx].title);
          }
          await geofenceUpdate(geofenceData, idx);
        }
      } catch (e) {
        errorNotifAlert(`skip Error : ${e}`);
      }
    };

    if (isNeedSkip == 1) {
      await skip();
    } else if (isNeedSkip == 2) {
      const todosRef = dbService.collection(`${UID}`);

      if (geofenceData.length == 1) {
        // 현재 일정이 마지막일 때
        cancelAllNotif(geofenceData[0].id);
        await geofenceUpdate(geofenceData);
        await todosRef.doc(`${geofenceData[0].id}`).update({ isSkip: true });
        skipNotifAlert();
        return geofenceData[0].id;
      } else {
        cancelAllNotif(geofenceData[0].id);
        await geofenceUpdate(geofenceData);
        await todosRef.doc(`${geofenceData[0].id}`).update({ isSkip: true });
        skipNotifAlert(geofenceData[1].title);
        return geofenceData[0].id;
      }
    }
    return null;
  } catch (e) {
    errorNotifAlert(`handleSkip Error : ${e}`);
  }
};

const skipNotifHandler = async (storeSkipUpdate, dispatch) => {
  try {
    const isNeedSkip = await checkGeofenceSchedule();

    if (isNeedSkip) {
      Alert.alert(
        `스킵 버튼`,
        '일정을 스킵하시겠습니까?',
        [
          { text: '취소' },
          {
            text: '확인',
            onPress: async () => {
              const skipID = await handleSkip(isNeedSkip);
              if (skipID !== null) {
                storeSkipUpdate(skipID);
              } else {
                await scrollRefresh(dispatch);
              }
              // PushNotification.getScheduledLocalNotifications((notif) =>
              //   console.log('예약된 알람 :', notif),
              // );
            },
          },
        ],
        {
          cancelable: false,
        },
      );
    } else {
      skipDenyAlert();
    }
  } catch (e) {
    errorNotifAlert(`skipNotifHandler Error : ${e}`);
  }
};

const handleStart = async () => {
  try {
    await checkDayChange();
    const isDayChange = await getDataFromAsync(KEY_VALUE_DAY_CHANGE);
    if (isDayChange) {
      const geofenceData = await getDataFromAsync(KEY_VALUE_GEOFENCE);
      if (geofenceData === null || geofenceData.length === 0) {
        startDenyAlert(1);
      } else {
        startAlert(geofenceUpdate, geofenceData);
      }
    } else {
      startDenyAlert(2);
    }
  } catch (e) {
    errorNotifAlert(`handleStart Error :  ${e}`);
  }
};

const TabBar = (props) => {
  const { state, descriptors, navigation } = props;
  const visibleName = useSelector((state) => state.tabBar);
  const network = useSelector((state) => state.network);

  const dispatch = useDispatch();
  const storeSkipUpdate = (targetId) => {
    dispatch(skip(targetId));
  };

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
                  style={{ marginRight: 27 }}
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
            width: '29.5%',
          }}
        >
          {network === 'online' ? (
            <>
              <TouchableOpacity
                onPress={() => network === 'online' && handleStart()}
                style={{ marginTop: 6, marginRight: 0 }}
              >
                <IconHandleStart
                  style={styles.navIcon}
                  name="icon-handle-reset"
                  size={(4 * SCREEN_WIDTH) / 85}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginTop: 5 }}
                onPress={() =>
                  network === 'online' &&
                  skipNotifHandler(storeSkipUpdate, dispatch)
                }
              >
                <ImageBackground
                  style={[
                    {
                      width: fontPercentage(20),
                      height: fontPercentage(20),
                    },
                  ]}
                  source={{ uri: 'iconHandleStart' }}
                />
              </TouchableOpacity>
            </>
          ) : null}
          <TouchableOpacity
            style={{ marginTop: 5 }}
            onPress={() => {
              network === 'online'
                ? navigation.navigate('Home', { screen: 'Home' })
                : navigation.navigate('OffHome', { screen: 'OffHome' });
            }}
          >
            <IconHome
              name="icon-home"
              size={(4.8 * CONTAINER_WIDTH) / 90}
              style={[styles.navIcon]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    width: SCREEN_WIDTH,
    height:
      SCREEN_HEIGHT < 668
        ? (SCREEN_HEIGHT * 27) / 230 - 10
        : (SCREEN_HEIGHT * 27) / 230 - 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    paddingLeft: 30,
    paddingRight: 25,
    paddingVertical:
      SCREEN_HEIGHT > 736
        ? (4 * SCREEN_HEIGHT) / 180
        : (4 * SCREEN_HEIGHT) / 190,
  },
  tabContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: SCREEN_HEIGHT > 668 ? 'flex-end' : 'center',
    justifyContent: 'space-between',
    paddingLeft: 2,
  },

  tabUnderBar: {
    backgroundColor: '#229892',
    width: (SCREEN_WIDTH * 47) / 370,
    height:
      SCREEN_HEIGHT > 1000
        ? (4 * SCREEN_HEIGHT) / 815
        : (2.5 * SCREEN_HEIGHT) / 815,
    position: 'absolute',
    top: fontPercentage(30),
    left: fontPercentage(-4.2),
  },
  tabBarText: {
    fontFamily: 'GodoB',
    fontWeight: 'bold',
    fontSize: fontPercentage(21),
    marginBottom: 0,
  },
  navIcon: {
    color: '#717171',
    width: fontPercentage(22),
    height: fontPercentage(22),
  },
});

export default TabBar;
