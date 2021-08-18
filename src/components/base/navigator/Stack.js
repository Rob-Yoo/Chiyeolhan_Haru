import React from 'react';
import Map from 'components/screen/Map';
import ToDoModal from 'components/modal/ToDoModal';
import { createStackNavigator } from '@react-navigation/stack';
import { WrapperComponent } from 'components/modal/WrapperComponent';
import { SchedullScreenDetail } from './ScheduleScreenDetail';

const Stack = createStackNavigator();

export function ModalStack({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SchedullScreenDetail"
        component={SchedullScreenDetail}
        navigation={navigation}
        option={{ headerShown: false }}
      />

      <Stack.Screen
        name="TodoModal"
        component={ToDoModal}
        navigation={navigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Map"
        component={Map}
        navigation={navigation}
        options={{ headerShown: false }}
      />

      {/* <Stack.Screen
        name="WrapperComponent"
        component={WrapperComponent}
        navigation={navigation}
        options={{ headerShown: false }}
      /> */}
    </Stack.Navigator>
  );
}
