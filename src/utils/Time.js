export const getTimeDifference = (startTime, currentTime) => {
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
