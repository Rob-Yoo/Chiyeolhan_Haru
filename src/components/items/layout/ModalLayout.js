import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});

export const ModalLayout = ({
  isVisible,
  children,
  taskListVisibleHandler,
}) => {
  return (
    <Modal style={{ margin: 0, alignItems: 'center' }} isVisible={isVisible}>
      <TouchableOpacity
        style={styles.background}
        activeOpacity={1}
        onPress={taskListVisibleHandler}
      />

      {children}
    </Modal>
  );
};
