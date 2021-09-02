import React, { useState } from 'react';
import { ScheduleComponent } from 'components/items/ScheduleComponent';
import { makeScheduleDate } from 'utils/makeScheduleData';
import { useSelector } from 'react-redux';
import ScheduleLayout from 'components/items/layout/ScheduleLayout';

const ScheduleTomorrow = () => {
  const tmorrowData = [];
  const storeData = useSelector((state) => state);
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = async () => {
    try {
      setModalVisible(!isModalVisible);
      await AsyncStorage.removeItem(KEY_VALUE_START_TIME);
    } catch (e) {
      console.log('toggleModal Error :', e);
    }
  };
  makeScheduleDate(storeData, tmorrowData, false);

  return (
    <>
      <ScheduleLayout
        isToday={false}
        handleModal={() => toggleModal()}
        isModalVisible={isModalVisible}
      >
        <ScheduleComponent day={'tomorrow'} events={tmorrowData} />
      </ScheduleLayout>
    </>
  );
};

export default ScheduleTomorrow;
