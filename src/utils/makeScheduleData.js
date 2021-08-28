import { DAY, MONTH, YEAR } from 'constant/const';
import { TODAY, TOMORROW } from 'constant/const';

export const makeScheduleDate = (toDos, toDoArr, isToday) => {
  for (key in toDos) {
    const isDone = toDos[key].isDone;
    console.log(toDos[key]);
    console.log(isDone);
    const startH = toDos[key].startTime.replace(/:\d\d/, '');
    const startM = toDos[key].startTime.replace(/\d\d:/, '');
    const endH = toDos[key].finishTime.replace(/:\d\d/, '');
    const endM = toDos[key].finishTime.replace(/\d\d:/, '');
    if (isToday && toDos[key].date === TODAY) {
      toDoArr.push({
        id: toDos[key].id,
        description: toDos[key].title,
        startDate: new Date(YEAR, MONTH - 1, DAY, startH, startM),
        endDate: new Date(YEAR, MONTH - 1, DAY, endH, endM),
        location: toDos[key].location,
        color: isDone ? '#54BCB6' : '#B9B9B9',
      });
    } else if (!isToday && toDos[key].date === TOMORROW) {
      toDoArr.push({
        id: toDos[key].id,
        description: toDos[key].title,
        startDate: new Date(YEAR, MONTH - 1, DAY + 1, startH, startM),
        endDate: new Date(YEAR, MONTH - 1, DAY + 1, endH, endM),
        location: toDos[key].location,
        color: isDone ? '#54BCB6' : '#B9B9B9',
      });
    }
  }
};
