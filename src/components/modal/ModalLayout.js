import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export const ModalLayout = ({ isVisibe, children }) => {
  return (
    <Modal style={{ margin: 0 }} isVisible={isVisibe}>
      <TouchableOpacity style={styles.background} activeOpacity={1} />
      <View style={{ alignItems: 'center' }}>{children}</View>
    </Modal>
  );
};
