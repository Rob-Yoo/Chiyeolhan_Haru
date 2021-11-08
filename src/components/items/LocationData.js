import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { fontPercentage } from 'utils/responsiveUtil';

export const LocationData = ({
  locationData,
  modalHandler,
  locationDataHandler,
}) => {
  const { location, address } = locationData;
  const searchedLocation = () => {
    locationDataHandler(locationData);
    modalHandler();
  };

  return (
    <View style={styles.locationInfoCard}>
      <View style={{ flex: 4 }}>
        <Text style={styles.locationTitle}>{location}</Text>
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            flexWrap: 'nowrap',
            paddingRight: 40,
          }}
        >
          <Text style={styles.address}>도로명</Text>
          <View
            style={{
              width: 2,
              height: 17,
              marginHorizontal: 3,
              backgroundColor: '#C4C4C4',
            }}
          />
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
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
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
    marginBottom: 5,
  },
  addressText: {
    color: '#000000BA',
    fontSize: fontPercentage(11),
    marginRight: 10,
    paddingTop: 2,
    paddingVertical: -2,
  },
  address: {
    fontFamily: 'NotoSansKR-Regular',
    color: '#C4C4C4',

    borderWidth: 1.5,
    borderColor: '#C4C4C4',
    fontSize: fontPercentage(10),
    // marginRight: 4,
    // marginLeft: 10,
    paddingBottom: 5,
    height: 17,
  },

  locationFinButton: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#54BCB6',
  },
  locationFinText: {
    fontFamily: 'GodoB',
    fontSize: 20,
    color: '#FFFFFF',
  },
});
