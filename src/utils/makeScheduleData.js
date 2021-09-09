import { DAY, MONTH, YEAR, TODAY, TOMORROW } from 'constant/const';
import { getCurrentTime } from 'utils/Time';

export const makeScheduleDate = (toDos, toDoArr, isToday) => {
  for (key in toDos) {
    const isDone = toDos[key].isDone;
    const taskList = [...toDos[key].toDos];

    const startH = toDos[key].startTime.replace(/:\d\d/, '');
    const startM = toDos[key].startTime.replace(/\d\d:/, '');
    const endH = toDos[key].finishTime.replace(/:\d\d/, '');
    const endM = toDos[key].finishTime.replace(/\d\d:/, '');
    if (isToday && toDos[key].date === TODAY) {
      toDoArr.push({
        id: toDos[key].id,
        description: toDos[key].title,
        location: toDos[key].location,
        startDate: new Date(YEAR, MONTH - 1, DAY, startH, startM),
        endDate: new Date(YEAR, MONTH - 1, DAY, endH, endM),
        startTime: toDos[key].startTime,
        finishTime: toDos[key].finishTime,
        location: toDos[key].location,
        color:
          isDone && getCurrentTime() >= toDos[key].startTime
            ? '#54BCB6'
            : '#B9B9B9',
        toDos: taskList,
      });
    } else if (!isToday && toDos[key].date === TOMORROW) {
      toDoArr.push({
        id: toDos[key].id,
        description: toDos[key].title,
        location: toDos[key].location,
        startDate: new Date(YEAR, MONTH - 1, DAY + 1, startH, startM),
        endDate: new Date(YEAR, MONTH - 1, DAY + 1, endH, endM),
        startTime: toDos[key].startTime,
        location: toDos[key].location,
        color: '#B9B9B9',
        toDos: taskList,
      });
    }
  }
};
