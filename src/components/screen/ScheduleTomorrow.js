import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import ToDoModal from 'components/modal/ToDoModal';
import AddToDoIcon from '#assets/icons/icon-add-todo.js';
import { makeScheduleDate } from 'utils/makeScheduleData';
import { ScheduleComponent } from 'components/items/ScheduleCompoentn';
import { useSelector } from 'react-redux';
const styles = StyleSheet.create({
  addToDoButton: {
    width: 60,
    height: 60,
    bottom: 50,
    right: 30,
    position: 'absolute',
    backgroundColor: '#FFF',
    borderRadius: 50,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 3.4,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
});

export default function ScheduleTomorrow({ navigation }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const tomorrowToDos = [];
  const toDos = useSelector((state) => state);
  console.log(toDos);
  makeScheduleDate(toDos, tomorrowToDos, false);
  console.log(tomorrowToDos);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  return (
    <>
      <View style={{ flex: 1 }}>
        <ScheduleComponent toDos={tomorrowToDos} istoday={false} />
      </View>
      <TouchableOpacity style={styles.addToDoButton} onPress={toggleModal}>
        <AddToDoIcon name="icon-add-todo" size={60} color={'#54BCB6'} />
      </TouchableOpacity>
      <ToDoModal
        navigation={navigation}
        modalHandler={() => toggleModal()}
        isModalVisible={isModalVisible}
        isToday={false}
      />
    </>
  );
}
