import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import ToDoModal from 'components/modal/ToDoModal';

import AddToDoIcon from '#assets/icons/icon-add-todo.js';

import { checkGeofenceSchedule } from 'utils/gfSchedulerUtil';
import { checkDayChange } from 'utils/asyncStorageUtil';
import { addModifyBlockAlert } from 'utils/buttonAlertUtil';

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
  const network = useSelector((state) => state.network);

  const pressAddButton = async () => {
    await checkDayChange();
    const block = await checkGeofenceSchedule();
    if (block == 1) {
      addModifyBlockAlert();
    } else {
      handleModal();
    }
  };

  return (
    <>
      <View style={{ flex: 1 }}>{children}</View>
      {isToday !== 'yesterday' && network === 'online' ? (
        <TouchableOpacity style={styles.addToDoButton} onPress={pressAddButton}>
          <AddToDoIcon name="icon-add-todo" size={60} color={'#54BCB6'} />
        </TouchableOpacity>
      ) : (
        <></>
      )}
      {network === 'online' ? (
        <ToDoModal
          navigation={navigation}
          modalHandler={handleModal}
          passModalData={passModalData}
          setPassModalData={setPassModalData}
          isModalVisible={isModalVisible}
          isToday={isToday}
        />
      ) : null}
    </>
  );
};

export default ScheduleLayout;
