import React from 'react';
import { ScheduleComponent } from 'components/items/ScheduleCompoentn';
import { makeScheduleDate } from 'utils/makeScheduleData';
import { useSelector } from 'react-redux';
import Schedule from 'components/items/scheduleLayout';

export default function ScheduleToday() {
  const todayData = [];
  const storeData = useSelector((state) => state);
  makeScheduleDate(storeData, todayData, true);

  return (
    <>
      <Schedule isToday={true}>
        <ScheduleComponent day={'today'} events={todayData} />
      </Schedule>
    </>
  );
}
