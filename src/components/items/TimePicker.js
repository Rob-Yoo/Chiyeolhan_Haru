import React, { useState } from 'react';
import { View, Button } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

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
  const { isVisible, setVisible, timeText, pickerHandler } = props;
  const [time, setTime] = useState('00:00');
  const showTimePicker = () => {
    setVisible(true);
  };

  const hideTimePicker = () => {
    setVisible(false);
  };

  const handleConfirm = (time) => {
    setTime(time.format('HH:mm'));
    pickerHandler(time.format('HH:mm'));
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
        onConfirm={handleConfirm}
        onCancel={hideTimePicker}
        locale="en_GB"
        date={new Date()}
      />
    </View>
  );
};
