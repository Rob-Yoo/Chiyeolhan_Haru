import React from 'react';
import { ScheduleComponent } from 'components/items/ScheduleCompoentn';
import { makeScheduleDate } from 'utils/makeScheduleData';
import { useSelector } from 'react-redux';
import ScheduleLayout from 'components/items/ScheduleLayout';

export default function ScheduleTomorrow() {
  const tmorrowData = [];
  const storeData = useSelector((state) => state);
  makeScheduleDate(storeData, tmorrowData, false);

  return (
    <>
      <ScheduleLayout isToday={false}>
        <ScheduleComponent day={'tomorrow'} events={tmorrowData} />
      </ScheduleLayout>
    </>
  );
}
