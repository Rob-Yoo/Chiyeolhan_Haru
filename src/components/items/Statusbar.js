import React, { useEffect, useRef, useState } from 'react';
import { View, Animated } from 'react-native';

import { getCurrentTime } from 'utils/Time';

class Statusbar extends React.Component {

  const updateStatusBar = () => {
    Animated.timing(statusBarWidth, {
      toValue: 100,
      duration: 5000,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    updateStatusBar();
  }, []);

  const animationStyles = { width: `${statusBarWidth}%` };

  return (
    <Animated.View
      style={[
        {
          //   width: `${width}%`,
          height: 10,

          backgroundColor: '#FFFFFF',
          borderRadius: 5,
          position: 'absolute',
        },
        animationStyles,
      ]}
    />
  );
};
