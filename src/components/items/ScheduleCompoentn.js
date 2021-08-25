import React from 'react';
import WeekView from 'react-native-week-view';
import { DAY, MONTH, YEAR } from 'constant/const';

export const ScheduleComponent = ({ toDos, istoday }) => {
  return (
    <WeekView
      events={toDos}
      selectedDate={new Date(YEAR, MONTH, istoday ? DAY : DAY + 1)}
      numberOfDays={1}
      headerStyle={{
        color: '#ECF5F471',
        borderColor: '#ECF5F471',
      }}
      eventContainerStyle={{
        backGroundColor: '#ECF5F471',
      }}
      //formatTimeLabel="h:mm A"
      formatTimeLabel="H:mm"
      showTitle={false}
      showNowLine={true}
      prependMostRecent={true}
    />
  );
};
