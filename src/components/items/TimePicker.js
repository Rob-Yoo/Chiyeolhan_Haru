import React, { useState } from 'react';
import { View, Button } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-community/async-storage';
import { KEY_VALUE_START_TIME } from 'constant/const';
import { getTimeDiff } from 'utils/Time';
import {
  alertStartTimePicker,
  alertFinsihTimePicker,
} from 'utils/TwoButtonAlert';

Date.prototype.format = function (f) {
  if (!this.valueOf()) return ' ';

  var weekName = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ];
  var d = this;

  return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function ($1) {
    switch ($1) {
      case 'yyyy':
        return d.getFullYear();
      case 'yy':
        return (d.getFullYear() % 1000).zf(2);
      case 'MM':
        return (d.getMonth() + 1).zf(2);
      case 'dd':
        return d.getDate().zf(2);
      case 'E':
        return weekName[d.getDay()];
      case 'HH':
        return d.getHours().zf(2);
      case 'hh':
        return ((h = d.getHours() % 12) ? h : 12).zf(2);
      case 'mm':
        return d.getMinutes().zf(2);
      case 'ss':
        return d.getSeconds().zf(2);
      case 'a/p':
        return d.getHours() < 12 ? '오전' : '오후';
      default:
        return $1;
    }
  });
};
String.prototype.string = function (len) {
  var s = '',
    i = 0;
  while (i++ < len) {
    s += this;
  }
  return s;
};
String.prototype.zf = function (len) {
  return '0'.string(len - this.length) + this;
};
Number.prototype.zf = function (len) {
  return this.toString().zf(len);
};

export const TimePicker = (props) => {
  const { isStart, timeText, pickerHandler, isToday } = props;
  const [isVisible, setVisible] = useState(false);
  const [time, setTime] = useState('00:00');
  const timeObject = new Date();
  const hour =
    timeObject.getHours() < 10
      ? `0${timeObject.getHours()}`
      : timeObject.getHours();
  const min =
    timeObject.getMinutes() < 10
      ? `0${timeObject.getMinutes()}`
      : timeObject.getMinutes();
  const currentTime = `${hour}:${min}`;

  const showTimePicker = () => {
    setVisible(true);
  };

  const hideTimePicker = () => {
    setVisible(false);
  };

  const checkValidateStarTime = async (formatTime) => {
    try {
      if (isToday) {
        if (currentTime <= formatTime) {
          await AsyncStorage.setItem(KEY_VALUE_START_TIME, formatTime);
          handleConfirm(formatTime);
        } else {
          alertStartTimePicker(hideTimePicker);
        }
      } else {
        await AsyncStorage.setItem(KEY_VALUE_START_TIME, formatTime);
        handleConfirm(formatTime);
      }
    } catch (e) {
      console.log('checkValidateStarTime Error :', e);
    }
  };

  const checkValidateFinishTime = async (formatTime) => {
    try {
      const startTime = await AsyncStorage.getItem(KEY_VALUE_START_TIME);
      if (startTime != null) {
        const timeDiff = getTimeDiff(startTime, formatTime);
        if (timeDiff >= 5) {
          await AsyncStorage.removeItem(KEY_VALUE_START_TIME);
          handleConfirm(formatTime);
        } else {
          alertFinsihTimePicker(
            '시작시간과 최소 5분 간격으로 설정해주세요.',
            hideTimePicker,
          );
        }
      } else {
        alertFinsihTimePicker('시작시간부터 설정해주세요.', hideTimePicker);
      }
    } catch (e) {
      console.log('checkValidateFinishTime Error :', e);
    }
  };

  const checkValidateTime = async (timeData) => {
    const formatTime = timeData.format('HH:mm');
    if (isStart) {
      await checkValidateStarTime(formatTime);
    } else {
      await checkValidateFinishTime(formatTime);
    }
  };

  const handleConfirm = (formatTime) => {
    setTime(formatTime);
    pickerHandler(formatTime);
    hideTimePicker();
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      <Button
        color="#142423"
        title={`${timeText}시간: ${time}`}
        onPress={showTimePicker}
      />
      <DateTimePickerModal
        isVisible={isVisible}
        mode="time"
        onConfirm={checkValidateTime}
        onCancel={hideTimePicker}
        locale="en_GB"
        date={new Date()}
      />
    </View>
  );
};
