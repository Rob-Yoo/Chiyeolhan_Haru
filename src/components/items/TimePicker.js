import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useSelector } from 'react-redux';

import { getTimeDiff } from 'utils/timeUtil';
import {
  alertStartTimePicker,
  alertFinsihTimePicker,
} from 'utils/buttonAlertUtil';
import { fontPercentage } from 'utils/responsiveUtil';

import { KEY_VALUE_START_TIME } from 'constant/const';

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

export const TimePicker = ({
  isStart,
  timeText,
  pickerHandler,
  isToday,
  timeDate,
  isOngoing,
}) => {
  const network = useSelector((state) => state.network);
  const [isVisible, setVisible] = useState(false);
  const [time, setTime] = useState('00:00');
  const [lowTime, setLowTime] = useState(new Date());
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
    if (isOngoing || network === 'offline') return;
    setVisible(true);
  };

  const hideTimePicker = () => {
    setVisible(false);
  };

  const checkValidStartTime = async (formatTime) => {
    try {
      if (isToday) {
        if (currentTime <= formatTime) {
          await AsyncStorage.setItem(KEY_VALUE_START_TIME, formatTime);
          handleConfirm(formatTime);
        } else {
          alertStartTimePicker();
        }
      } else {
        await AsyncStorage.setItem(KEY_VALUE_START_TIME, formatTime);
        handleConfirm(formatTime);
      }
    } catch (e) {
      console.log('checkValidStartTime Error :', e);
    }
  };

  const checkValidFinishTime = async (formatTime) => {
    try {
      const startTime = await AsyncStorage.getItem(KEY_VALUE_START_TIME);
      if (startTime != null) {
        const timeDiff = getTimeDiff(startTime, formatTime);
        if (timeDiff >= 5) {
          handleConfirm(formatTime);
        } else {
          alertFinsihTimePicker('시작 시간 이후로 설정해주세요.');
        }
      } else {
        alertFinsihTimePicker('시작 시간부터 설정해주세요.');
      }
    } catch (e) {
      console.log('checkValidFinishTime Error :', e);
    }
  };

  const checkValidTime = async (timeData) => {
    setLowTime(timeData);
    let formatTime = timeData.format('HH:mm');
    const restMin = formatTime.slice(0, 4);
    const oneDigitMin = formatTime.slice(4);
    if ('1' <= oneDigitMin && oneDigitMin <= '4') {
      formatTime = restMin + '0';
    } else if ('6' <= oneDigitMin && oneDigitMin <= '9') {
      formatTime = restMin + '5';
    }
    if (isStart) {
      await checkValidStartTime(formatTime);
    } else {
      await checkValidFinishTime(formatTime);
    }
  };
  useEffect(() => {
    setLowTime(timeDate);
    if (timeDate) {
      const hour =
        timeDate.getHours() < 10
          ? `0${timeDate.getHours()}`
          : timeDate.getHours();
      const minute =
        timeDate.getMinutes() < 10
          ? `0${timeDate.getMinutes()}`
          : timeDate.getMinutes();
      setTime(`${hour}:${minute}`);
      pickerHandler(`${hour}:${minute}`);
    }
  }, []);
  const handleConfirm = (formatTime) => {
    setTime(formatTime);
    pickerHandler(formatTime);
    hideTimePicker();
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity onPress={showTimePicker} style={{ marginLeft: -7.2 }}>
        <Text
          style={{
            fontFamily: 'NotoSansKR-Black',
            fontSize: fontPercentage(15),
            color: '#fff',
          }}
        >
          {time}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        mode="time"
        locale="en_GB"
        onConfirm={checkValidTime}
        onCancel={hideTimePicker}
        isVisible={isVisible}
        cancelTextIOS="취소"
        confirmTextIOS="완료"
        minuteInterval={5}
        date={lowTime === undefined ? new Date() : lowTime}
      />
    </View>
  );
};
