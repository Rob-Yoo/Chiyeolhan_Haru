import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AddToDoIcon from '#assets/icons/icon-tasklist-add-button.js';
import ToDoModal from 'components/modal/ToDoModal';
const styles = StyleSheet.create({
  addToDoButton: {
    width: 50,
    height: 50,
    position: 'absolute',
    bottom: 50,
    right: 30,
  },
});

export default function ScheduleToday() {
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  return (
    <>
      <View>
        <Text>Today</Text>
      </View>
      <TouchableOpacity style={styles.addToDoButton} onPress={toggleModal}>
        <AddToDoIcon
          name="icon-tasklist-add-button"
          size={30}
          color={'#54BCB6'}
        />
      </TouchableOpacity>

      <ToDoModal
        modalHandler={() => toggleModal()}
        isModalVisible={isModalVisible}
      />
    </>
  );
}
