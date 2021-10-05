import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import ScheduleLayout from 'components/items/layout/ScheduleLayout';
import { ScheduleComponent } from 'components/items/ScheduleComponent';

import { makeScheduleDate } from 'utils/makeScheduleData';

import { KEY_VALUE_START_TIME } from 'constant/const';

const ScheduleToday = ({ navigation }) => {
  const todayData = [];
  const storeData = useSelector((state) => state.toDos);
  const [isModalVisible, setModalVisible] = useState(false);
  const [passModalData, setPassModalData] = useState(undefined);
  const network = useSelector((state) => state.network);

  const passToModalData = (event) => {
    setPassModalData(event);
    toggleModal();
  };
  const toggleModal = async () => {
    try {
      setModalVisible(!isModalVisible);
      await AsyncStorage.removeItem(KEY_VALUE_START_TIME);
    } catch (e) {
      console.log('toggleModal Error :', e);
    }
  };

  makeScheduleDate(storeData, todayData, 'today', network);

  return (
    <>
      <ScheduleLayout
        isToday={true}
        handleModal={() => toggleModal()}
        isModalVisible={isModalVisible}
        passModalData={passModalData}
        setPassModalData={setPassModalData}
        navigation={navigation}
      >
        <ScheduleComponent
          day={'today'}
          events={todayData}
          handleModal={toggleModal}
          passToModalData={passToModalData}
        />
      </ScheduleLayout>
    </>
  );
};

export default ScheduleToday;
