import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { Favorite } from 'components/screen/Favorite';

const Stack = createStackNavigator();

export const ModalStack = ({ navigation }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Favorite"
        component={Favorite}
        navigation={navigation}
        header
      />
    </Stack.Navigator>
  );
};
