import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AddToDoIcon from '#assets/icons/icon-add-todo.js';
import ToDoModal from 'components/modal/ToDoModal';
import { ScheduleComponent } from 'components/items/ScheduleCompoentn';
import { makeScheduleDate } from 'utils/makeScheduleData';
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

export default function ScheduleToday({ navigation }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const todayToDos = [];
  const toDos = useSelector((state) => state);
  makeScheduleDate(toDos, todayToDos, true);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  return (
    <>
      <View style={{ flex: 1 }}>
        <ScheduleComponent toDos={todayToDos} istoday={true} />
      </View>
      <TouchableOpacity style={styles.addToDoButton} onPress={toggleModal}>
        <AddToDoIcon name="icon-add-todo" size={60} color={'#54BCB6'} />
      </TouchableOpacity>
      <ToDoModal
        navigation={navigation}
        modalHandler={() => toggleModal()}
        isModalVisible={isModalVisible}
        isToday={true}
      />
    </>
  );
}
