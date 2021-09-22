import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { CommonActions } from '@react-navigation/native';

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
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    paddingLeft: 20,
  },
  tabBarText: {
    fontFamily: 'GodoB',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 25,
  },
});

export default function TabBar(props) {
  const { state, descriptors, navigation } = props;
  //const [visibleName, setVisibleName] = useState(true);
  const visibleName = useSelector((state) => state.tabBar);
  const network = useSelector((state) => state.network);

  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        let label = options.tabBarLabel;
        const isFocused = state.index === index;

        const onLongPress = () => {
          visibleName === 'today'
            ? navigation.navigate('yesterday')
            : navigation.navigate('today');
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
              style={{
                width:
                  isFocused ||
                  (!isFocused &&
                    visibleName === 'today' &&
                    route.name === 'today') ||
                  (!isFocused &&
                    visibleName === 'yesterday' &&
                    route.name === 'yesterday')
                    ? null
                    : 0,
              }}
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
            style={{ marginRight: 180 }}
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
        onPress={() =>
          network === 'online'
            ? navigation.navigate('Home', { screen: 'Home' })
            : navigation.navigate('OffHome', { screen: 'OffHome' })
        }
      >
        <Text style={[styles.tabBarText, { color: '#ADADAD' }]}>홈</Text>
      </TouchableOpacity>
    </View>
  );
}
