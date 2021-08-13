import React from 'react';
import ScheduleToday from 'components/screen/ScheduleToday';
import ScheduleTomorrow from 'components/screen/ScheduleTomorrow';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { navOptionHandler } from './HomeNav';

const Tab = createMaterialTopTabNavigator();

export function SchedullScreenDetail({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitle: false,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="오늘"
        component={ScheduleToday}
        options={navOptionHandler}
      />
      <Tab.Screen
        name="내일"
        component={ScheduleTomorrow}
        options={navOptionHandler}
      />
    </Tab.Navigator>
  );
}
