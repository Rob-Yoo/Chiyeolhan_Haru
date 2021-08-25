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
