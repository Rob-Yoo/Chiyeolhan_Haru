import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import IconModalQuestion from '#assets/icons/icon-modal-question';

const styles = StyleSheet.create({
  toDoModalContainer: { flex: 1, justifyContent: 'center', margin: 0 },
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'transparent',
  },
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalTopContainer: {
    alignItems: 'center',
    borderRadius: 10,
    marginTop: '50%',
    backgroundColor: '#54BCB6',
    height: 300,
    borderRadius: 50,
    marginTop: -10,
  },
  modalTextView: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
    marginTop: 20,
  },
  modalTopText: {
    fontFamily: 'NotoSansKR-Bold',
    color: '#FFFFFF',
  },
  modalInputContainer: {
    backgroundColor: '#e2ece9',
    marginTop: 150,
    height: 650,
    borderRadius: 50,
  },
});

export const WrapperComponent = ({
  modalHandler,
  navigation,
  routeName,
  locationData,
}) => {
  const location = locationData?.locationData?.location ?? false;
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.background}
        activeOpacity={1}
        onPress={modalHandler}
      />
      <View style={styles.modalInputContainer}>
        <View style={styles.modalTopContainer}>
          <View style={styles.modalTextView}>
            <TouchableOpacity>
              <Text style={styles.modalTopText}>취소</Text>
            </TouchableOpacity>
            <TextInput />
            <TouchableOpacity onPress={modalHandler}>
              <Text style={styles.modalTopText}>완료</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: 200,
              height: 200,
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: 100,
              paddingHorizontal: 65,
              paddingVertical: 40,
              marginBottom: 20,
            }}
          >
            <IconModalQuestion
              size={50}
              name="icon-modal-question"
              size={110}
              color={'#FFFFFF'}
              onPress={() =>
                navigation.navigate('ModalStack', {
                  screen: 'Map',
                  params: { routeName },
                })
              }
            />
          </View>
          <Text style={styles.modalLocationText}>
            {location ? location : '물음표를 눌러주세요'}
          </Text>
        </View>
      </View>
    </View>
  );
};
