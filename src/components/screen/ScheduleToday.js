import React from 'react';
import { ScheduleComponent } from 'components/items/ScheduleCompoentn';
import { makeScheduleDate } from 'utils/makeScheduleData';
import { useSelector } from 'react-redux';
import ScheduleLayout from 'components/items/ScheduleLayout';

export default function ScheduleToday() {
  const todayData = [];
  const storeData = useSelector((state) => state);
  makeScheduleDate(storeData, todayData, true);

  return (
    <>
      <ScheduleLayout isToday={true}>
        <ScheduleComponent day={'today'} events={todayData} />
      </ScheduleLayout>
    </>
  );
}
