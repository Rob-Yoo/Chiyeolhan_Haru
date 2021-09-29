import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { setTabBar } from 'redux/store';

import IconHome from '#assets/icons/icon-home';

import { getCurrentTime } from 'utils/Time';
import { getDataFromAsync } from 'utils/AsyncStorage';
import { geofenceUpdate } from 'utils/BgGeofence';
import { resetAlert, resetDenyAlert } from 'utils/TwoButtonAlert';
import { checkGeofenceSchedule } from 'utils/GeofenceScheduler';

import { KEY_VALUE_GEOFENCE } from 'constant/const';

const TabBar = (props) => {
  const { state, descriptors, navigation } = props;
  //const [visibleName, setVisibleName] = useState(true);
  const visibleName = useSelector((state) => state.tabBar);
  const network = useSelector((state) => state.network);
  const dispatch = useDispatch();

  const handleReset = async () => {
    try {
      // 지오펜스 일정 중 트래킹이 안된 일정이 있는 경우 현재 시간과 가장 가까운 일정으로 넘어간다.
      const isNeedReset = await checkGeofenceSchedule();
      const geofenceData = await getDataFromAsync(KEY_VALUE_GEOFENCE);
      const currentTime = getCurrentTime();
      let idx = 0;

      if (isNeedReset) {
        for (const data of geofenceData) {
          if (data.finishTime > currentTime) {
            break;
          }
          idx += 1;
        }
        await geofenceUpdate(geofenceData, idx);
        resetAlert(geofenceData[idx].startTime);
      } else {
        resetDenyAlert();
      }
    } catch (e) {
      console.log('handleReset Error :', e);
    }
  };

  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        let label = options.tabBarLabel;
        const isFocused = state.index === index;

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
              swipeEnabled={options.swipeEnabled}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
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
        }

        return (
          <TouchableOpacity
            isFocused={isFocused}
            onPress={onPress}
            key={`tab_${index}`}
            style={{ marginRight: 120 }}
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
      <TouchableOpacity
        style={{
          width: 30,
          height: 30,
          backgroundColor: 'red',
          borderRadius: 30,
        }}
        onPress={() => handleReset()}
      >
        <Text>리셋버튼</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          network === 'online'
            ? navigation.navigate('Home', { screen: 'Home' })
            : navigation.navigate('OffHome', { screen: 'OffHome' })
        }
      >
        <IconHome
          name="icon-home"
          size={20}
          style={[styles.tabBarText, { color: '#717171' }]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabUnderBar: {
    backgroundColor: '#229892',
    width: 50,
    height: 3,
    position: 'absolute',
    bottom: -10,
    right: -5,
  },
  tabContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  tabBarText: {
    fontFamily: 'GodoB',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 25,
  },
});

export default TabBar;
