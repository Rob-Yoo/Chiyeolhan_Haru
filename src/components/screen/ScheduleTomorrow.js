import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AddToDoIcon from '#assets/icons/icon-tasklist-add-button.js';
import { WrapperComponent } from '../modal/WrapperComponent';
import Modal from 'react-native-modal';
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
  // console.log(`today route: ${JSON.stringify(route)}`);
  const { params: locationData } = route;
  // console.log(locationData);
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
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
      {isModalVisible ? (
        <WrapperComponent
          navigation={navigation}
          navigationHandler={() => goToMap()}
          modalHandler={() => toggleModal()}
          routeName={route.name}
          locationData={locationData}
        />
      ) : (
        <></>
      )}
    </>
  );
}
