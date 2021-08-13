import React from 'react';
import Home from 'components/screen/Home';
import Map from 'components/screen/Map';
import ToDoModal from 'components/modal/ToDoModal';
import { navOptionHandler, Stack } from './HomeNav';
import { SchedullScreenDetail } from './ScheduleScreenDetail';

export function ModalStack({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TodoModal"
        component={ToDoModal}
        navigation={navigation}
        options={navOptionHandler}
      />
      <Stack.Screen
        name="Map"
        navigation={navigation}
        options={navOptionHandler}
        component={Map}
      />
    </Stack.Navigator>
  );
}

export function HomeStack({ navigation }) {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} options={navOptionHandler} />
      <Stack.Screen
        name="ScheduleToday"
        navigation={navigation}
        component={SchedullScreenDetail}
      />
    </Stack.Navigator>
  );
}
