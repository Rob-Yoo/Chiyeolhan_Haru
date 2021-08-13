import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  taskHeader: {
    top: 0,
    paddingHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
    flexShrink: 0,
  },
  taskContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
    maxHeight: 100,
  },
  task: {
    backgroundColor: '#FFF',
    width: '80%',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginLeft: 20,
    paddingVertical: 20,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 3.4,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  taskText: {
    maxWidth: '100%',
    color: '#38504F',
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 20,
  },
});

export const Task = (props) => {
  const { text: taskText } = props;
  return (
    <>
      <View style={styles.taskContainer}>
        <View style={styles.task}>
          <Text style={styles.taskText}>
            {taskText.length > 17 ? `${taskText.substr(0, 16)}...` : taskText}
          </Text>
        </View>
      </View>
    </>
  );
};
