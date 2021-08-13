import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { HomeStack, ModalStack } from './Stack';

export const Stack = createStackNavigator();
export const navOptionHandler = { headerShown: false };

export default function HomeNav() {
  return (
    <Stack.Navigator
      mode="modal"
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitle: false,
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeStack} />
      <Stack.Screen name="ModalStack" component={ModalStack} />
    </Stack.Navigator>
  );
}
