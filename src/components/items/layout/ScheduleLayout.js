import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AddToDoIcon from '#assets/icons/icon-add-todo.js';
import ToDoModal from 'components/modal/ToDoModal';

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

const ScheduleLayout = ({
  navigation,
  isToday,
  children,
  handleModal,
  isModalVisible,
  passModalData,
  setPassModalData,
}) => {
  return (
    <>
      <View style={{ flex: 1 }}>{children}</View>
      <TouchableOpacity style={styles.addToDoButton} onPress={handleModal}>
        <AddToDoIcon name="icon-add-todo" size={60} color={'#54BCB6'} />
      </TouchableOpacity>
      <ToDoModal
        navigation={navigation}
        modalHandler={handleModal}
        passModalData={passModalData}
        setPassModalData={setPassModalData}
        isModalVisible={isModalVisible}
        isToday={isToday}
      />
    </>
  );
};

export default ScheduleLayout;
