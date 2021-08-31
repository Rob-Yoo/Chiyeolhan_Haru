import React from 'react';
import WeekView from 'react-native-week-view';
import { DAY, MONTH, YEAR } from 'constant/const';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';

const BACKGROUND_COLOR = '#ECF5F471';
const styles = StyleSheet.create({
  text: {
    color: '#fff',
    textAlign: 'left',
    fontWeight: 'bold',
    fontFamily: 'NotoSansKR-bold',
  },
  description: {
    fontSize: 20,
  },
  location: {
    fontSize: 10,
  },
});

const MyEventComponent = ({ event, position }) => {
  return (
    <>
      <View color={event.color}>
        <Text style={[styles.text, styles.description]}>
          {event.description}
        </Text>
        <View style={{ flexDirection: 'row', marginLeft: 15 }}>
          <View
            style={{
              width: 3,
              height: 15,
              backgroundColor: '#fff',
              marginRight: 5,
            }}
          />
          <Text style={[styles.text, styles.location]}>{event.location}</Text>
        </View>
      </View>
    </>
  );
};
export const ScheduleComponent = ({ events, day }) => {
  let weekStart = new Date().getDay();
  let selectedDate = '';
  switch (day) {
    case 'today':
      selectedDate = new Date(YEAR, MONTH - 1, DAY);
      break;
    case 'yesterday':
      selectedDate = new Date(YEAR, MONTH - 1, DAY - 1);
      weekStart -= 1;
      break;
    case 'tomorrow':
      selectedDate = new Date(YEAR, MONTH - 1, DAY + 1);
      weekStart = weekStart + 1;
      break;
  }

  return (
    <WeekView
      events={events}
      selectedDate={selectedDate}
      fixedHorizontally={true}
      weekStartsOn={weekStart}
      numberOfDays={1}
      formatTimeLabel="HH:mm A"
      showTitle={false}
      showNowLine={true}
      headerStyle={{
        color: BACKGROUND_COLOR,
        borderColor: BACKGROUND_COLOR,
      }}
      onEventPress={(event) => console.log(event)}
      onEventLongPress={(event) => console.log('delete')}
      headerTextStyle={{ color: BACKGROUND_COLOR }}
      eventContainerStyle={{
        maxWidth: 250,
        left: 40,
      }}
      scrollToTimeNow={true}
      EventComponent={MyEventComponent}
    />
  );
};
