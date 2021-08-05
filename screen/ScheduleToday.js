import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  addToDoButton: {
    width: 50,
    height: 50,
    position: "absolute",
    bottom: 50,
    right: 30,
  },
});
export default function ScheduleToday({ navigation }) {
  const openToDoModal = () => navigation.navigate("ModalStack");
  return (
    <>
      <View style={{ flex: 1 }}>
        <Text>Today</Text>
        <TouchableOpacity style={styles.addToDoButton} onPress={openToDoModal}>
          <Text>플러스버튼</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
