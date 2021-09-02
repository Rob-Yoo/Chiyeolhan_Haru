import React, { useState } from 'react';
import { ScheduleComponent } from 'components/items/ScheduleComponent';
import { makeScheduleDate } from 'utils/makeScheduleData';
import { useSelector } from 'react-redux';
import ScheduleLayout from 'components/items/layout/ScheduleLayout';

const ScheduleTomorrow = () => {
  const tmorrowData = [];
  const storeData = useSelector((state) => state);
  const [isModalVisible, setModalVisible] = useState(false);
  const [passModalData, setPassModalData] = useState(undefined);

  const passToModalData = (event) => {
    //async에있는 데이터를 타임테이블에서 투두 선택시 해당 투두( 모달로 넘겨준다
    console.log(`passtomodalData ${JSON.stringify(event)}`);
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
  makeScheduleDate(storeData, tmorrowData, false);

  return (
    <>
      <ScheduleLayout
        isToday={false}
        handleModal={() => toggleModal()}
        isModalVisible={isModalVisible}
        passModalData={passModalData}
        setPassModalData={setPassModalData}
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
