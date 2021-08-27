import React from 'react';
import WeekView from 'react-native-week-view';
import { DAY, MONTH, YEAR } from 'constant/const';

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
  return day === 'tomorrow' ? (
    <WeekView
      events={events}
      selectedDate={selectedDate}
      fixedHorizontally={true}
      weekStartsOn={weekStart}
      numberOfDays={1}
      headerStyle={{
        color: '#ECF5F471',
        borderColor: '#ECF5F471',
      }}
      eventContainerStyle={{
        backGroundColor: '#ECF5F471',
      }}
      formatTimeLabel="HH:mm A"
      showTitle={false}
      showNowLine={true}
    />
  ) : (
    <WeekView
      events={events}
      selectedDate={selectedDate}
      fixedHorizontally={true}
      weekStartsOn={weekStart}
      numberOfDays={1}
      headerStyle={{
        color: '#ECF5F471',
        borderColor: '#ECF5F471',
      }}
      eventContainerStyle={{
        backGroundColor: '#ECF5F471',
      }}
      formatTimeLabel="HH:mm A"
      showTitle={false}
      showNowLine={true}
    ></WeekView>
  );
};
