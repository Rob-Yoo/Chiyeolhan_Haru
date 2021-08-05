import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import ScheduleToday from '../screen/ScheduleToday';
import ScheduleTomorrow from '../screen/ScheduleTomorrow';
import Home from '../screen/Home';
import Map from '../screen/Map';
import ToDoModal from '../components/ToDoModal';
const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
const navOptionHandler = () => ({
  headerShown: false,
});
function SchedullScreenDetail({ navigation }) {
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
function ModalStack({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TodoModal"
        component={ToDoModal}
        navigation={navigation}
        options={navOptionHandler}
      />
      <Stack.Screen name="Map" component={Map} />
    </Stack.Navigator>
  );
}
function HomeStack({ navigation }) {
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
