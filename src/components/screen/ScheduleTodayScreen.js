import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ScheduleLayout from 'components/items/layout/ScheduleLayout';
import { ScheduleComponent } from 'components/items/ScheduleComponent';

import { getDataFromAsync } from 'utils/asyncStorageUtil';
import { makeScheduleDate } from 'utils/makeScheduleData';
import { errorNotifAlert } from 'utils/buttonAlertUtil';

import { KEY_VALUE_START_TIME, KEY_VALUE_SUCCESS } from 'constant/const';
import { Keyboard } from 'react-native';

const ScheduleToday = ({ navigation, route }) => {
  const todayData = [];
  const storeData = useSelector((state) => state.toDos);
  const dispatch = useDispatch();

  const [isModalVisible, setModalVisible] = useState(false);
  const [passModalData, setPassModalData] = useState(undefined);
  const network = useSelector((state) => state.network);
  let waitings = [];
  const [waitingList, setWaitingList] = useState([]);

  useEffect(() => {
    getWaitingEvent();
  }, []);

  const getWaitingEvent = async () => {
    const successSchedules = await getDataFromAsync(KEY_VALUE_SUCCESS);
    successSchedules &&
      successSchedules.map((schedule) => waitings.push(schedule.id));
    waitings.length !== 0 && setWaitingList(waitings);
  };

  const passToModalData = async (event) => {
    setPassModalData(event);
    await toggleModal();
  };

  const toggleModal = async () => {
    try {
      Keyboard.dismiss();
      setModalVisible(!isModalVisible);
      await AsyncStorage.removeItem(KEY_VALUE_START_TIME);
    } catch (e) {
      errorNotifAlert(`toggleModal Error : ${e}`);
    }
  };

  if (route.skipID !== undefined) {
    dispatch(skip(skipID));
  }
  makeScheduleDate(storeData, todayData, 'today', network, waitingList);

  return (
    <>
      <ScheduleLayout
        isToday={true}
        handleModal={async () => await toggleModal()}
        isModalVisible={isModalVisible}
        passModalData={passModalData}
        setPassModalData={setPassModalData}
        navigation={navigation}
      >
        <ScheduleComponent
          day={'today'}
          events={todayData}
          handleModal={async () => await toggleModal()}
          passToModalData={passToModalData}
        />
      </ScheduleLayout>
    </>
  );
};

export default ScheduleToday;
