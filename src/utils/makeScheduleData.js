import { getCurrentTime, getDate } from 'utils/timeUtil';

const FAIL_COLOR = '#C3C3C3';
const DEFAULT_COLOR = '#54BCB6';
export const makeScheduleDate = (
  toDos,
  toDoArr,
  day,
  netwrok = 'online',
  waitingList = null,
) => {
  const { DAY, MONTH, YEAR, TODAY, TOMORROW, YESTERDAY } = getDate();
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
      const status = waitingList.includes(toDos[key].id) ? 'waiting' : null;
      toDoArr.push({
        id: toDos[key].id,
        description: toDos[key].title,
        location: toDos[key].location,
        startDate: new Date(YEAR, MONTH - 1, DAY, startH, startM),
        endDate: new Date(YEAR, MONTH - 1, DAY, endH, endM),
        startTime: toDos[key].startTime,
        finishTime: toDos[key].finishTime,
        color:
          netwrok === 'offline' ||
          status === 'waiting' ||
          (((isDone && getCurrentTime() >= toDos[key].startTime) ||
            getCurrentTime() < toDos[key].startTime ||
            getCurrentTime() < toDos[key].finishTime) &&
            !toDos[key].isSkip)
            ? DEFAULT_COLOR
            : FAIL_COLOR,
        toDos: [...toDos[key].toDos],
        isDone,
        status,
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
        color: DEFAULT_COLOR,
        toDos: [...toDos[key].toDos],
        isDone,
        status: null,
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
        color: isDone || netwrok === 'offline' ? DEFAULT_COLOR : FAIL_COLOR,
        toDos: [...toDos[key].toDos],
        isDone,
        status: null,
      });
    }
  }
};
