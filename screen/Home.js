import React, { useEffect } from "react";
import toDos from "../store";
import { View, Text, Platform, Linking } from "react-native";
import styled from "styled-components/native";
//import { dbService } from '../firebase';
//import { Alert } from 'react-native';
import { Provider } from "react-redux";
//import * as Location from 'expo-location';
import HomeContent from "../components/HomeContent";

const ScheduleButton = styled.TouchableOpacity``;
const ScheduleIcon = styled.Text``;

export default function Home({ navigation }) {
  const goToScheduleToday = () => navigation.navigate("ScheduleToday");
  //   const openAppSettings = () => {
  //     if (Platform.OS === 'ios') {
  //       Linking.openSettings();
  //     } // android 일 때 생각해줘야함
  //   };
  //   const createTwoButtonAlert = () =>
  //     Alert.alert(
  //       '위치정보 이용 제한',
  //       '설정에서 위치정보 이용에 대한 액세스 권한을 허용해주세요.',
  //       [
  //         {
  //           text: '취소',
  //           style: 'cancel',
  //         },
  //         { text: '설정', onPress: () => openAppSettings() },
  //       ],
  //       { cancelable: false }
  //     );
  //   useEffect(() => {
  //     (async () => {
  //       let { status } = await Location.requestForegroundPermissionsAsync();
  //       if (status !== 'granted') {
  //         createTwoButtonAlert();
  //       } else {
  //         const current = await Location.getCurrentPositionAsync({});
  //         await dbService.collection('location').add({
  //           latitude: current.coords.latitude,
  //           longitude: current.coords.longitude,
  //         });
  //       }
  //     })();
  //   }, []);
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
