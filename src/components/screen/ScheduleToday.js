import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { dbToAsyncStorage } from "utils/AsyncStorage";
import { dbService } from "utils/firebase";
import AddToDoIcon from "#assets/icons/icon-tasklist-add-button.js";
import { UID } from "constant/const";

const styles = StyleSheet.create({
  addToDoButton: {
    width: 50,
    height: 50,
    position: "absolute",
    bottom: 50,
    right: 30,
  },
});
const ScheduleToday = ({ navigation }) => {
  // useEffect(() => {
  //   const date = new Date();
  //   const today =
  //     (date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1) +
  //     (date.getDay() < 10 ? `0${date.getDay() + 1}` : date.getDay());
  //   const todosRef = dbService.collection(`${UID}`);
  //   dbToAsyncStorage(todosRef, today);
  // });
  const openToDoModal = () => navigation.navigate("ModalStack");
  return (
    <>
      <View style={{ flex: 1 }}>
        <Text>Today</Text>
        <TouchableOpacity style={styles.addToDoButton} onPress={openToDoModal}>
          <AddToDoIcon
            name="icon-tasklist-add-button"
            size={30}
            color={"#54BCB6"}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ScheduleToday;
