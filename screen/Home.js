import React from "react";
import toDos from "../redux/store";
import { View, Text } from "react-native";
import styled from "styled-components/native";
import { Provider } from "react-redux";
import HomeContent from "../components/HomeContent";

const ScheduleButton = styled.TouchableOpacity``;
const ScheduleIcon = styled.Text``;

function Home({ navigation, props }) {
  const goToScheduleToday = () => navigation.navigate("ScheduleToday");
  return (
    <>
      <View
        style={{
          flex: 0.5,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text>{`오늘도
하루를 치열하게`}</Text>
        <ScheduleButton>
          <ScheduleIcon onPress={goToScheduleToday}>달력아이콘</ScheduleIcon>
        </ScheduleButton>
      </View>
      <Provider store={toDos}>
        <HomeContent />
      </Provider>
    </>
  );
}

export default Home;
