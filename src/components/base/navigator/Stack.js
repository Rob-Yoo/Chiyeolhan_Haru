import React from 'react';
import Map from 'components/screen/Map';
//import Favorite from 'components/screen/Favorite';
import ToDoModal from 'components/modal/ToDoModal';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export const ModalStack = ({ navigation }) => {
  return (
    <Stack.Navigator>
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
        name="Favorite"
        component={Favorite}
        navigation={navigation}
      /> */}
    </Stack.Navigator>
  );
};
