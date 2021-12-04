import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import RNRestart from 'react-native-restart';

import ScheduleLayout from 'components/items/layout/ScheduleLayout';
import { ScheduleComponent } from 'components/items/ScheduleComponent';

import { checkDayChange, getDataFromAsync } from 'utils/asyncStorageUtil';
import {
  startBtnAlert,
  skipBtnAlert,
  errorNotifAlert,
} from 'utils/buttonAlertUtil';
import { checkGeofenceSchedule } from 'utils/gfSchedulerUtil';
import { getCurrentTime, getTimeDiff } from 'utils/timeUtil';
import { makeScheduleDate } from 'utils/makeScheduleData';

import {
  KEY_VALUE_START_TIME,
  KEY_VALUE_START_TODO,
  KEY_VALUE_GEOFENCE,
} from 'constant/const';

const ScheduleTomorrow = ({ navigation }) => {
  const tmorrowData = [];
  const storeData = useSelector((state) => state.toDos);
  const [isModalVisible, setModalVisible] = useState(false);
  const [passModalData, setPassModalData] = useState(undefined);

  const alertStartBtn = async () => {
    const geofenceData = await getDataFromAsync(KEY_VALUE_GEOFENCE);
    const isStartTodo = await getDataFromAsync(KEY_VALUE_START_TODO);

    if (!isStartTodo) {
      if (geofenceData !== null) {
        if (geofenceData.length > 0) {
          const currentTime = getCurrentTime();
          const timeDiff = getTimeDiff(currentTime, geofenceData[0].startTime);
          if (timeDiff <= 15) {
            // 첫 일정의 시작 시간의 15분 전부터 시작 버튼을 눌러달라고 알림창을 띄움
            startBtnAlert();
          }
        }
      }
    }
  };

  const alertSkipBtn = async () => {
    const isNeedSkip = await checkGeofenceSchedule();
    const isStartTodo = await getDataFromAsync(KEY_VALUE_START_TODO);

    if (isStartTodo) {
      if (isNeedSkip === 1) {
        skipBtnAlert();
      }
    }
  };

  useEffect(() => {
    alertStartBtn();
    alertSkipBtn();
    return async () => {
      const isDaychange = await checkDayChange();
      if (isDaychange) RNRestart.Restart();
    };
  }, []);

  const passToModalData = (event) => {
    setPassModalData(event);
    toggleModal();
  };
  const toggleModal = async () => {
    try {
      setModalVisible(!isModalVisible);
      await AsyncStorage.removeItem(KEY_VALUE_START_TIME);
    } catch (e) {
      errorNotifAlert(`toggleModal Error : ${e}`);
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
