import React from 'react';
import ScheduleToday from 'components/screen/ScheduleToday';
import ScheduleTomorrow from 'components/screen/ScheduleTomorrow';
import ScheduleYesterday from 'components/screen/ScheduleYesterday';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TabBar from 'components/base/navigator/TabBar';

const Tab = createMaterialTopTabNavigator(tabNavigatorConfig);
const tabNavigatorConfig = {
  tabBarScrollEnabled: false,
  swipeEnabled: false,
};
export const SchedullScreenDetail = ({ navigation }) => {
  return (
    <Tab.Navigator
      initialRouteName="today"
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen
        name="yesterday"
        component={ScheduleYesterday}
        options={{ tabBarLabel: '어제' }}
      />
      <Tab.Screen
        name="today"
        component={ScheduleToday}
        options={{ tabBarLabel: '오늘' }}
        navigation={navigation}
      />

      <Tab.Screen
        name="tomorrow"
        component={ScheduleTomorrow}
        options={{ tabBarLabel: '내일' }}
      />
    </Tab.Navigator>
  );
};

// export const SchedullScreenDetail = ({ navigation }) => {
//   return (
//     <Tab.Navigator
//       tabBarOptions={{
//         activeTintColor: '#229892',
//         inactiveTintColor: '#ADADAD',

//         labelStyle: {
//           fontFamily: 'NotosansKR-Bold',
//           fontSize: 20,
//           fontWeight: 'bold',
//         },
//         indicatorStyle: {
//           backgroundColor: '#229892',
//           marginLeft: 25,
//           width: 50,
//         },
//         tabStyle: { width: 100, marginTop: 30 },
//       }}
//     >
//       <Tab.Screen
//         name="today"
//         navigation={navigation}
//         component={ScheduleToday}
//       />
//       <Tab.Screen
//         name="tomorrow"
//         navigation={navigation}
//         component={ScheduleTomorrow}
//       />
//       <Tab.Screen
//         name="yesterday"
//         navigation={navigation}
//         component={ScheduleYesterday}
//       />
//     </Tab.Navigator>
//   );
// };
