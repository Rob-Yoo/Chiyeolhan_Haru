import React from 'react';
import { ScheduleComponent } from 'components/items/ScheduleCompoentn';
import { makeScheduleDate } from 'utils/makeScheduleData';
import { useSelector } from 'react-redux';
import Schedule from 'components/items/scheduleLayout';

export default function ScheduleTmorrow() {
  const tmorrowData = [];
  const storeData = useSelector((state) => state);
  makeScheduleDate(storeData, tmorrowData, false);

  return (
    <>
      <Schedule isToday={false}>
        <ScheduleComponent day={'tomorrow'} events={tmorrowData} />
      </Schedule>
    </>
  );
}
