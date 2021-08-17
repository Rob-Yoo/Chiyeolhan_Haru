import React from 'react';
import Map from 'components/screen/Map';
import ToDoModal from 'components/modal/ToDoModal';
import { createStackNavigator } from '@react-navigation/stack';
import { WrapperComponent } from 'components/modal/WrapperComponent';

const Stack = createStackNavigator();
export function ModalStack({ navigation }) {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen
        name="TodoModal"
        component={ToDoModal}
        navigation={navigation}
        options={{ headerShown: false }}
      /> */}

      <Stack.Screen
        name="Map"
        navigation={navigation}
        options={{ headerShown: false }}
        component={Map}
      />
      <Stack.Screen
        name="WrapperComponent"
        navigation={navigation}
        options={{ headerShown: false }}
        component={WrapperComponent}
      />
    </Stack.Navigator>
  );
}
