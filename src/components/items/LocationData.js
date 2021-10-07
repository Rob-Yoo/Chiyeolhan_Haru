import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const LocationData = ({
  locationData,
  modalHandler,
  locationDataHandler,
}) => {
  const searchedLocation = () => {
    locationDataHandler(locationData);
    modalHandler();
  };
  const { location, address } = locationData;
  return (
    <View style={styles.locationInfoCard}>
      <View style={{ flex: 4 }}>
        <Text style={styles.locationTitle}>{location}</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            flexWrap: 'nowrap',
            paddingRight: 40,
          }}
        >
          <Text style={styles.address}>도로명</Text>
          <Text style={styles.addressText}>{address}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.locationFinButton}
        onPress={searchedLocation}
      >
        <Text style={styles.locationFinText}>완료</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  locationInfoCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    height: 110,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    maxHeight: 130,
    marginBottom: 20,
    position: 'absolute',
    left: 20,
    right: 0,
    bottom: 20,
  },
  locationTitle: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 20,
    color: '#000000',
    marginBottom: 10,
  },
  addressText: {
    color: '#000000BA',
    marginRight: 2,
    paddingHorizontal: 10,
  },
  address: {
    fontFamily: 'NotoSansKR-Regular',
    color: '#C4C4C4',
    width: 43,
    height: 24,
    borderWidth: 2,
    borderColor: '#C4C4C4',
  },
  locationFinButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 85,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#54BCB6',
  },
  locationFinText: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
});
