import React from 'react';

import { Favorite } from 'components/screen/Favorite';
import { createStackNavigator } from '@react-navigation/stack';

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
