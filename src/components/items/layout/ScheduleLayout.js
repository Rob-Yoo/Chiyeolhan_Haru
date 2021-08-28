import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AddToDoIcon from '#assets/icons/icon-add-todo.js';
import ToDoModal from 'components/modal/ToDoModal';
import AsyncStorage from '@react-native-community/async-storage';
import { KEY_VALUE_START_TIME } from 'constant/const';

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

const Schedule = ({ navigation, isToday, children }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = async () => {
    try {
      setModalVisible(!isModalVisible);
      await AsyncStorage.removeItem(KEY_VALUE_START_TIME);
    } catch (e) {
      console.log('toggleModal Error :', e);
    }
  };
  return (
    <>
      <View style={{ flex: 1 }}>{children}</View>
      <TouchableOpacity style={styles.addToDoButton} onPress={toggleModal}>
        <AddToDoIcon name="icon-add-todo" size={60} color={'#54BCB6'} />
      </TouchableOpacity>
      <ToDoModal
        navigation={navigation}
        modalHandler={() => toggleModal()}
        isModalVisible={isModalVisible}
        isToday={isToday}
      />
    </>
  );
};

export default Schedule;
