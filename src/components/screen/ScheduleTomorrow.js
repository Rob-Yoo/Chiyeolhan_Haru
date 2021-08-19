import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
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
        <AddToDoIcon
          name="icon-tasklist-add-button"
          size={30}
          color={'#54BCB6'}
        />
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
