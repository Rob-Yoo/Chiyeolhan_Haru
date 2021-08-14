import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import AddToDoIcon from '#assets/icons/icon-tasklist-add-button.js';

const styles = StyleSheet.create({
  addToDoButton: {
    width: 50,
    height: 50,
    position: 'absolute',
    bottom: 50,
    right: 30,
  },
});

export default function ScheduleToday({ navigation }) {
  const openToDoModal = () => navigation.navigate('ModalStack');
  return (
    <>
      <View style={{ flex: 1 }}>
        <Text>Today</Text>
        <TouchableOpacity style={styles.addToDoButton} onPress={openToDoModal}>
          <AddToDoIcon
            name="icon-tasklist-add-button"
            size={30}
            color={'#54BCB6'}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}
