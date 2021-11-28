import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { fontPercentage } from 'utils/responsiveUtil';
import { SCREEN_HEIGHT } from '../../constant/const';

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
        <Text
          style={[
            styles.locationTitle,
            { fontSize: location.length > 12 ? 14 : 19 },
          ]}
        >
          {location}
        </Text>
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
              height: fontPercentage(15),
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
    height: SCREEN_HEIGHT * 0.112,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
    position: 'absolute',
    left: 20,
    right: 0,
    bottom: 20,
    shadowColor: 'rgba(0, 0, 0, 0.14)',
    shadowOffset: {
      width: 3.5,
      height: 3.5,
    },
    shadowRadius: 5,
    shadowOpacity: 1,
  },
  locationTitle: {
    fontFamily: 'NotoSansKR-Bold',
    color: '#000000',
    marginBottom: 7,
    paddingRight: 10,
    letterSpacing: -0.29,
  },
  addressText: {
    color: '#000000BA',
    fontSize: fontPercentage(12),
    marginRight: 10,
    letterSpacing: -0.17,
    marginTop: 1,
    fontWeight: '500',
  },
  address: {
    fontFamily: 'NotoSansKR-Regular',
    color: '#C4C4C4',
    borderWidth: 1,
    borderColor: '#C4C4C4',
    fontSize: fontPercentage(10),
    height: 16,

    fontWeight: '600',
  },

  locationFinButton: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    width: '100%',
    height: 41,
    borderRadius: 9,
    backgroundColor: '#54BCB6',
  },
  locationFinText: {
    fontFamily: 'GodoB',
    fontSize: fontPercentage(20),
    color: '#FFFFFF',
  },
});
