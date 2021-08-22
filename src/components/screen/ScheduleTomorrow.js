import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
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

export default function ScheduleTomorrow({ navigation, route }) {
  const { params: locationData } = route;
  const [isModalVisible, setModalVisible] = useState(false);
  const [slideUpValue, setSlideValue] = useState(new Animated.Value(0));
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    console.log(isModalVisible);
  };
  return (
    <>
      <View>
        <Text>Tomorrow</Text>
      </View>
      <TouchableOpacity style={styles.addToDoButton} onPress={toggleModal}>
        <AddToDoIcon name="icon-add-todo" size={60} color={'#54BCB6'} />
      </TouchableOpacity>

      <ToDoModal
        navigation={navigation}
        modalHandler={() => toggleModal()}
        routeName={route.name}
        locationData={locationData}
        isModalVisible={isModalVisible}
      />
    </>
  );
}
