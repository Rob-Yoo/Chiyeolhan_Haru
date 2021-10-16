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
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    position: 'absolute',
    bottom: 44,
    right: 19,
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
          <AddToDoIcon name="icon-add-todo" size={50} color={'#54BCB6'} />
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
