import React, { useEffect, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { TouchableOpacity, View, Text, Image } from "react-native";
import DeviceInfo from "react-native-device-info";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { add, create } from "../redux/store";
import { dbService } from "../firebase";
const uid = DeviceInfo.getUniqueId();
const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ECF5F471",
  },
  modaltopcontainer: {
    width: "100%",
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#54BCB6",
    borderRadius: 50,
    padding: 30,
  },
});
function ToDoModal({ toDos, createToDo, addToDo, navigation }) {
  const goToMap = () => navigation.navigate("Map");
  const { register, handleSubmit, setValue } = useForm();
  const [taskList, setTaskList] = useState([]);
  const [targetId, setTargetId] = useState("?");
  const [task, setTask] = useState("");

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const titleSubmit = async (data) => {
    const { todostarttime, todofinishtime, todotitle } = data;
    const id = Date.now();
    const date = new Date();
    let today =
      (date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1) +
      (date.getDay() < 10 ? `0${date.getDay() + 1}` : date.getDay());

    setValue("todoid", id);
    await dbService.collection(`${uid}`).doc(`${id}`).set({
      id,
      title: todotitle,
      starttime: todostarttime,
      finishtime: todofinishtime,
      location: "장소명",
      longitude: "경도",
      latitude: "위도",
      date: today,
      todos: [],
    });
    const todo = [id, todostarttime, todofinishtime, todotitle, today];
    createToDo(todo);
  };
  const taskSubmit = (data) => {
    const { todotask, todoid } = data;
    setTaskList((taskList) => [...taskList, todotask]);
    setTargetId(todoid);
    addToDo(todotask, todoid);
    setTask("");
  };
  const completed = async () => {
    await dbService
      .collection(`${uid}`)
      .doc(`${targetId}`)
      .update({
        todos: [...taskList],
      });
  };

  useEffect(() => {
    register("todostarttime"),
      register("todofinishtime"),
      register("todotitle"),
      register("todoid");
    register("todotask");
  }, [register]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.modaltopcontainer}>
          <TouchableOpacity>
            <Text>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToMap}>
            <Text>지도자리</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              completed();
              navigation.goBack();
            }}
          >
            <Text>완료</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.modalinputcontainer}>
          <TextInput
            placeholder="시작시간:00:00"
            onChangeText={(text) => setValue("todostarttime", text)}
          ></TextInput>
          <TextInput
            placeholder="마칠시간:00:00"
            onChangeText={(text) => setValue("todofinishtime", text)}
          ></TextInput>
          <TextInput
            placeholder="제목을 입력해 주세요"
            onChangeText={(text) => setValue("todotitle", text)}
          ></TextInput>
          <TouchableOpacity onPress={handleSubmit(titleSubmit)}>
            <Text>추가</Text>
          </TouchableOpacity>
          <TextInput
            placeholder="수행리스트"
            onChangeText={(text) => {
              setTask(text);
              setValue("todotask", text);
            }}
            returnKeyType="done"
            value={task}
            onSubmitEditing={handleSubmit(taskSubmit)}
          ></TextInput>
        </View>
      </View>
    </>
  );
}
function mapStateToProps(state) {
  return { toDos: state };
}
function mapDispatchToProps(dispatch) {
  return {
    createToDo: (todo) => dispatch(create(todo)),
    addToDo: (task, id) => dispatch(add({ task, id })),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ToDoModal);
