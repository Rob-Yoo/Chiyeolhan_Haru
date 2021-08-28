import React from 'react';
import WeekView from 'react-native-week-view';
import { DAY, MONTH, YEAR } from 'constant/const';
import { createPortal } from 'react-dom';
import { View } from 'react-native';

export const ScheduleComponent = ({ events, day }) => {
  let weekStart = new Date().getDay();
  let selectedDate = '';
  switch (day) {
    case 'today':
      selectedDate = new Date(YEAR, MONTH - 1, DAY);
      break;
    case 'yesterday':
      selectedDate = new Date(YEAR, MONTH - 1, DAY - 1);
      weekStart -= 1;
      break;
    case 'tomorrow':
      selectedDate = new Date(YEAR, MONTH - 1, DAY + 1);
      weekStart = weekStart + 1;
      break;
  }
  const BACKGROUND_COLOR = '#ECF5F471';
  return (
    <WeekView
      events={events}
      selectedDate={selectedDate}
      fixedHorizontally={true}
      weekStartsOn={weekStart}
      numberOfDays={1}
      headerStyle={{
        color: BACKGROUND_COLOR,
        borderColor: BACKGROUND_COLOR,
      }}
      headerTextStyle={{ color: BACKGROUND_COLOR }}
      eventContainerStyle={{
        borderColor: 'red',
        borderRadius: 20,
        maxWidth: 200,
        left: 40,
      }}
      formatTimeLabel="HH:mm A"
      showTitle={false}
      showNowLine={true}
    />
  );
};
