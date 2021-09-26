import { DAY, MONTH, YEAR, TODAY, TOMORROW, YESTERDAY } from 'constant/const';
import { getCurrentTime } from 'utils/Time';

export const makeScheduleDate = (toDos, toDoArr, day) => {
  for (key in toDos) {
    if (
      Object.keys(toDos[`${key}`]).length !== 0 &&
      day === 'today' &&
      toDos[key].date === TODAY
    ) {
      const isDone = toDos[key].isDone;
      const startH = toDos[key].startTime?.replace(/:\d\d/, '');
      const startM = toDos[key].startTime?.replace(/\d\d:/, '');
      const endH = toDos[key].finishTime?.replace(/:\d\d/, '');
      const endM = toDos[key].finishTime?.replace(/\d\d:/, '');
      toDoArr.push({
        id: toDos[key].id,
        description: toDos[key].title,
        location: toDos[key].location,
        startDate: new Date(YEAR, MONTH - 1, DAY, startH, startM),
        endDate: new Date(YEAR, MONTH - 1, DAY, endH, endM),
        startTime: toDos[key].startTime,
        finishTime: toDos[key].finishTime,
        color:
          (isDone && getCurrentTime() >= toDos[key].startTime) ||
          getCurrentTime() < toDos[key].startTime ||
          getCurrentTime() < toDos[key].finishTime
            ? '#54BCB6'
            : '#B9B9B9',
        toDos: [...toDos[key].toDos],
        isDone,
      });
    } else if (
      Object.keys(toDos[`${key}`]).length !== 0 &&
      day === 'tomorrow' &&
      toDos[key].date === TOMORROW
    ) {
      const isDone = toDos[key].isDone;
      const startH = toDos[key].startTime.replace(/:\d\d/, '');
      const startM = toDos[key].startTime.replace(/\d\d:/, '');
      const endH = toDos[key].finishTime.replace(/:\d\d/, '');
      const endM = toDos[key].finishTime.replace(/\d\d:/, '');
      toDoArr.push({
        id: toDos[key].id,
        description: toDos[key].title,
        location: toDos[key].location,
        startDate: new Date(YEAR, MONTH - 1, DAY + 1, startH, startM),
        endDate: new Date(YEAR, MONTH - 1, DAY + 1, endH, endM),
        startTime: toDos[key].startTime,
        color: '#54BCB6',
        toDos: [...toDos[key].toDos],
        isDone,
      });
    } else if (
      Object.keys(toDos[`${key}`]).length !== 0 &&
      day === 'yesterday' &&
      toDos[key].date === YESTERDAY
    ) {
      const isDone = toDos[key].isDone;
      const startH = toDos[key].startTime.replace(/:\d\d/, '');
      const startM = toDos[key].startTime.replace(/\d\d:/, '');
      const endH = toDos[key].finishTime.replace(/:\d\d/, '');
      const endM = toDos[key].finishTime.replace(/\d\d:/, '');
      toDoArr.push({
        id: toDos[key].id,
        description: toDos[key].title,
        location: toDos[key].location,
        startDate: new Date(YEAR, MONTH - 1, DAY - 1, startH, startM),
        endDate: new Date(YEAR, MONTH - 1, DAY - 1, endH, endM),
        startTime: toDos[key].startTime,
        color: isDone ? '#54BCB6' : '#B9B9B9',
        toDos: [...toDos[key].toDos],
        isDone,
      });
    }
  }
};
