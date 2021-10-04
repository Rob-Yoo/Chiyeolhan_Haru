import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { useSelector } from 'react-redux';
import RNRestart from 'react-native-restart';

import ScheduleLayout from 'components/items/layout/ScheduleLayout';
import { ScheduleComponent } from 'components/items/ScheduleComponent';

import { checkDayChange } from 'utils/AsyncStorage';
import { makeScheduleDate } from 'utils/makeScheduleData';

import { KEY_VALUE_START_TIME } from 'constant/const';

const ScheduleTomorrow = ({ navigation }) => {
  const tmorrowData = [];
  const storeData = useSelector((state) => state.toDos);
  const [isModalVisible, setModalVisible] = useState(false);
  const [passModalData, setPassModalData] = useState(undefined);

  useEffect(() => {
    return async () => {
      const isDaychange = await checkDayChange();
      if (isDaychange) RNRestart.Restart();
    };
  });
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

  makeScheduleDate(storeData, tmorrowData, 'tomorrow');

  return (
    <>
      <ScheduleLayout
        isToday={false}
        handleModal={() => toggleModal()}
        isModalVisible={isModalVisible}
        passModalData={passModalData}
        setPassModalData={setPassModalData}
        navigation={navigation}
      >
        <ScheduleComponent
          day={'tomorrow'}
          events={tmorrowData}
          handleModal={toggleModal}
          passToModalData={passToModalData}
        />
      </ScheduleLayout>
    </>
  );
};

export default ScheduleTomorrow;
