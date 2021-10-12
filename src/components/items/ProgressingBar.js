import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { getCurrentTime } from 'utils/Time';

const UPDATE_EVERY_MILLISECONDS = 60 * 1000; // 1 minute

export const ProgressingBar = ({ startTime, finishTime }) => {
  const [currentWidth, setcurrentWidth] = useState(0);
  let intervalCallbackId = null;

  const getProgressBarWidth = (startTime, finishTime) => {
    if (getCurrentTime() >= finishTime) {
      return 100;
    } else {
      const date = new Date();
      const hour =
        date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
      const minute =
        date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
      const currentTime = (hour.toString() + minute.toString()) * 1;
      startTime = startTime.replace(':', '');
      finishTime = finishTime.replace(':', '');
      if (startTime < currentTime && finishTime > currentTime) {
        const denominator = finishTime - startTime;
        const numerator = currentTime - startTime;
        let width = Math.floor((numerator / denominator) * 100);
        return width;
      }
    }
  };

  useEffect(() => {
    intervalCallbackId = setInterval(() => {
      updateWidth(1000);
    }, UPDATE_EVERY_MILLISECONDS);

    return () => {
      if (intervalCallbackId) {
        clearInterval(intervalCallbackId);
      }
    };
  }, []);

  updateWidth = (animationDuration) => {
    const newWidth = getProgressBarWidth(startTime, finishTime);
    setcurrentWidth(newWidth);
  };
  return (
    <View
      style={[
        {
          width: `${currentWidth}%`,
          height: 10,
          backgroundColor: '#fff',
          borderRadius: 5,
          position: 'absolute',
        },
      ]}
    />
  );
};
