import { DAY, MONTH, YEAR } from 'constant/const';
import { TODAY, TOMORROW } from 'constant/const';
import { commonTimeExpression } from 'utils/Time';

export const makeScheduleDate = (toDos, toDoArr, isToday) => {
  for (key in toDos) {
    const startH = toDos[key].startTime.replace(/(^0)|(:)|(\d\d)/gi, '');
    const startM = toDos[key].startTime.replace(/(^0\d)|(:)|(0?)/gi, '');
    const endH = toDos[key].finishTime.replace(/(^0)|(:)|(\d\d)/gi, '');
    const endM = toDos[key].finishTime.replace(/(^0\d)|(:)|(0?)/gi, '');

    commonTimeExpression(toDos[key].startTime);
    //  console.log(isToday, toDos[key].date, TOMORROW);
    if (isToday && toDos[key].date === TODAY) {
      toDoArr.push({
        description: toDos[key].title,
        location: toDos[key].location,
        startDate: new Date(YEAR, MONTH, DAY, startH, startM),
        endDate: new Date(YEAR, MONTH, DAY, endH, endM),
        color: '#54BCB6',
      });
    } else if (!isToday && toDos[key].date === TOMORROW) {
      toDoArr.push({
        description: toDos[key].title,
        location: toDos[key].location,
        startDate: new Date(YEAR, MONTH, DAY, startH, startM),
        endDate: new Date(YEAR, MONTH, DAY, endH, endM),
        color: '#54BCB6',
      });
    }
  }
};
