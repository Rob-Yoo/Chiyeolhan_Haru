import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import ScheduleLayout from 'components/items/layout/ScheduleLayout';
import { ScheduleComponent } from 'components/items/ScheduleComponent';

import { makeScheduleDate } from 'utils/makeScheduleData';

const ScheduleYesterday = ({ navigation }) => {
  const yesterDayData = [];
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
    } catch (e) {
      console.log('toggleModal Error :', e);
    }
  };

  makeScheduleDate(storeData, yesterDayData, 'yesterday', network);

  return (
    <>
      <ScheduleLayout
        isToday={'yesterday'}
        handleModal={() => toggleModal()}
        isModalVisible={isModalVisible}
        passModalData={passModalData}
        setPassModalData={setPassModalData}
        navigation={navigation}
      >
        <ScheduleComponent
          day={'yesterday'}
          events={yesterDayData}
          handleModal={toggleModal}
          passToModalData={passToModalData}
        />
      </ScheduleLayout>
    </>
  );
};

export default ScheduleYesterday;
