import React from 'react';
import ScheduleToday from 'components/screen/ScheduleToday';
import ScheduleTomorrow from 'components/screen/ScheduleTomorrow';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

export const SchedullScreenDetail = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#229892',
        inactiveTintColor: '#ADADAD',

        labelStyle: {
          fontFamily: 'NotosansKR-Bold',
          fontSize: 20,
          fontWeight: 'bold',
        },
        indicatorStyle: {
          backgroundColor: '#229892',
          marginLeft: 25,
          width: 50,
        },
        tabStyle: { width: 100, marginTop: 30 },
      }}
    >
      <Tab.Screen name="오늘" component={ScheduleToday} />
      <Tab.Screen name="내일" component={ScheduleTomorrow} />
    </Tab.Navigator>
  );
};
