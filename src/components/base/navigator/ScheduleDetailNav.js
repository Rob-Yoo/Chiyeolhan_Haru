import React, { Fragment } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-navigation';

import TabBar from 'components/base/navigator/TabBarNav';
import ScheduleToday from 'components/screen/ScheduleTodayScreen';
import ScheduleTomorrow from 'components/screen/ScheduleTomorrowScreen';
import ScheduleYesterday from 'components/screen/ScheduleYesterdayScreen';

const Tab = createMaterialTopTabNavigator();

export const ScheduleDetail = ({ navigation }) => {
  const tabBar = useSelector((state) => state.tabBar);
  return (
    <Fragment>
      <SafeAreaView style={{ backgroundColor: '#fff' }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ECF5F471' }}>
        <Tab.Navigator
          initialRouteName="today"
          tabBar={(props) => <TabBar {...props} />}
        >
          {tabBar === 'yesterday' ? (
            <Tab.Screen
              name="yesterday"
              component={ScheduleYesterday}
              options={{ tabBarLabel: '어제' }}
            />
          ) : (
            <Tab.Screen
              name="today"
              component={ScheduleToday}
              options={{ tabBarLabel: '오늘' }}
              navigation={navigation}
            />
          )}

          <Tab.Screen
            name="tomorrow"
            component={ScheduleTomorrow}
            options={{ tabBarLabel: '내일' }}
          />
        </Tab.Navigator>
      </SafeAreaView>
    </Fragment>
  );
};
