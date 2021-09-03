export const getEarlyTimeDiff = (startTime, currentTime) => {
  const startHour = startTime.slice(0, 2);
  const startMin = startTime.slice(3);
  const currentHour = currentTime.slice(0, 2);
  const currentMin = currentTime.slice(3);

  const startMinInt = parseInt(startMin, 10);
  const currentMinInt = parseInt(currentMin, 10);

  if (startHour > currentHour) {
    return startMinInt + 60 - currentMinInt;
  } else {
    return startMinInt - currentMinInt;
  }
};

export const getLateTimeDiff = (startTime, currentTime) => {
  const startHour = startTime.slice(0, 2);
  const startMin = startTime.slice(3);
  const currentHour = currentTime.slice(0, 2);
  const currentMin = currentTime.slice(3);

  const startMinInt = parseInt(startMin, 10);
  const currentMinInt = parseInt(currentMin, 10);

  if (startHour < currentHour) {
    return currentMinInt + 60 - startMinInt;
  } else {
    return currentMinInt - startMinInt;
  }
};

export const getTimeDiff = (startTime, finishTime) => {
  const startHour = startTime.slice(0, 2);
  const startMin = startTime.slice(3);
  const finishHour = finishTime.slice(0, 2);
  const finishMin = finishTime.slice(3);

  const startMinInt = parseInt(startMin, 10);
  const finishMinInt = parseInt(finishMin, 10);

  if (startTime < finishTime) {
    if (startHour < finishHour) {
      return finishMinInt + 60 - startMinInt;
    } else {
      return finishMinInt - startMinInt;
    }
  }
  return 0;
};

export const isEarliestTime = (earliestTime, willAddTime) => {
  const earliestTimeHour = earliestTime.slice(0, 2);
  const earliestTimeMin = earliestTime.slice(3);
  const willAddTimeHour = willAddTime.slice(0, 2);
  const willAddTimeMin = willAddTime.slice(3);

  if (earliestTimeHour > willAddTimeHour) {
    return true;
  } else if (earliestTimeHour == willAddTimeHour) {
    return earliestTimeMin > willAddTimeMin ? true : false;
  } else {
    return false;
  }
};

export const commonTimeExpression = (time) => {
  const hour = time.slice(0, 2);
  let min = time.slice(3);
  let sdHour; // signle-digit hour
  let msg;

  if (hour < '10') {
    sdHour = hour.slice(1);
  }

  if (min < '10') {
    min = min.slice(1); // ex) "00" => "0"
  }

  if (hour > '12') {
    const pmHour = parseInt(hour) - 12;
    msg = min == '0' ? `오후 ${pmHour}시` : `오후 ${pmHour}시 ${min}분`;
  } else if (hour == '12') {
    msg = min == '0' ? `오후 ${hour}시` : `오후 ${hour}시 ${min}분`;
  } else if (hour == '00') {
    msg = min == '0' ? `오전 12시` : `오전 12시 ${min}분`;
  } else {
    msg = min == '0' ? `오전 ${sdHour}시` : `오전 ${sdHour}시 ${min}분`;
  }
  return msg;
};

export const makeNowTime = () => {
  const timeObject = new Date();
  const hour =
    timeObject.getHours() < 10
      ? `0${timeObject.getHours()}`
      : timeObject.getHours();
  const min =
    timeObject.getMinutes() < 10
      ? `0${timeObject.getMinutes()}`
      : timeObject.getMinutes();
  return `${hour}:${min}`;
};
