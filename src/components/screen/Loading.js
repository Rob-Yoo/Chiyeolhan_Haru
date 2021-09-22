import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Text,
} from 'react-native';

export const Loading = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Text>로딩</Text>
    </View>
  );
};
