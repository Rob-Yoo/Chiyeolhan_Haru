import React from 'react';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import toDos from '../store';
import ToDo from '../components/ToDo';

export default function ScheduleToday() {
  return (
    <>
      <View style={{ flex: 1 }}>
        <Text>Today</Text>
        <Provider store={toDos}>
          <ToDo />
        </Provider>
      </View>
    </>
  );
}
