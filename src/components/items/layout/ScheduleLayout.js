import React from 'react';
import { View, TouchableOpacity, StyleSheet, PixelRatio } from 'react-native';
import { useSelector } from 'react-redux';

import ToDoModal from 'components/modal/ToDoModal';

import AddToDoIcon from '#assets/icons/icon-add-todo.js';

import { checkGeofenceSchedule } from 'utils/gfSchedulerUtil';
import { checkDayChange } from 'utils/asyncStorageUtil';
import { addModifyBlockAlert } from 'utils/buttonAlertUtil';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../../constant/const';

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
          <AddToDoIcon
            name="icon-add-todo"
            size={(2 * SCREEN_WIDTH) / 15}
            color={'#54BCB6'}
          />
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
const styles = StyleSheet.create({
  addToDoButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: (52 * SCREEN_WIDTH) / 375,
    height: (52 * SCREEN_WIDTH) / 375,
    position: 'absolute',
    bottom: (SCREEN_HEIGHT * 35) / 650,
    right: 19,
    backgroundColor: '#FFF',
    borderRadius: 100,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});
