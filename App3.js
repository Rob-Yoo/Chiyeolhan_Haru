import * as React from "react";
import { Text, View, SafeAreaView, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import ScheduleToday from "./screen/ScheduleToday";
import ScheduleTomorrow from "./screen/ScheduleTomorrow";
import Home from "./screen/Home";
function CustomHeader({ title, isHome, navigation }) {
  return (
    <View
      style={{
        flexDirection: "row",
        height: 50,
      }}
    >
      {isHome ? (
        <TouchableOpacity
          style={{
            flex: 1.5,
            justifyContent: "center",
          }}
        >
          <Text style={{ textAlign: "center" }}>
            <Text>메뉴버튼</Text>
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>뒤로가기</Text>
        </TouchableOpacity>
      )}
      <View style={{ flex: 1 }}></View>
      <View
        style={{
          flex: 1.5,
          justifyContent: "center",
        }}
      >
        <Text style={{ textAlign: "center" }}>
          <Text>{title}</Text>
        </Text>
      </View>
      <View style={{ flex: 1 }}></View>
    </View>
  );
}
const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();
const navOptionHandler = () => ({
  headerShown: false,
});
function HomeScreen({ navigation }) {
  return <Home navigation={navigation} />;
}

function ScheduleTodayScreen({ navigation }) {
  return <ScheduleToday />;
}

function ScheduleTomorrowScreen({ navigation }) {
  return <ScheduleTomorrow />;
}
function HomeScreenDetail({ navigation }) {
  return (
    <Tab.Navigator initialRouteName="HomeDetai">
      <Tab.Screen name="ScheduleToday" component={ScheduleTodayScreen} />
      <Tab.Screen name="ScheduleTomorrow" component={ScheduleTomorrowScreen} />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={navOptionHandler}
      />
    </Tab.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={navOptionHandler}
      />
      <Stack.Screen name="ScheduleToday" component={HomeScreenDetail} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
