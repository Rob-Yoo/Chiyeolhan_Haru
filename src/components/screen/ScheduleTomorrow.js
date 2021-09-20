import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { KEY_VALUE_START_TIME } from 'constant/const';
import AsyncStorage from '@react-native-community/async-storage';
import { makeScheduleDate } from 'utils/makeScheduleData';
import ScheduleLayout from 'components/items/layout/ScheduleLayout';
import { ScheduleComponent } from 'components/items/ScheduleComponent';

const ScheduleTomorrow = ({ navigation }) => {
  const tmorrowData = [];
  const storeData = useSelector((state) => state.toDos);
  const [isModalVisible, setModalVisible] = useState(false);
  const [passModalData, setPassModalData] = useState(undefined);

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
  //console.log('schedule tomorrow');
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
