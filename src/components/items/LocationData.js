import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  locationDataSection: {
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    left: 20,
    bottom: 30,
  },
  locationInfoCard: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: 380,
    height: 130,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
  },
  locationTitle: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 20,
    color: '#000000',
    marginBottom: 15,
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
    marginRight: 4,
  },
  locationFinButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#54BCB6',
  },
  locationFinText: {
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
});

export const LocationData = (props) => {
  const { locationData, navigation } = props;
  const searchedLocation = () => {
    navigation.navigate('TodoModal', { locationData });
  };
  return (
    <View style={styles.locationDataSection}>
      <View style={styles.locationInfoCard} key={locationData.latitude}>
        <View style={{ flex: 4 }}>
          <Text style={styles.locationTitle}>{locationData.location}</Text>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              flexWrap: 'nowrap',
              paddingRight: 40,
            }}
          >
            <Text style={styles.address}>도로명</Text>
            <Text style={styles.addressText}>{locationData.address}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.locationFinButton}
          onPress={searchedLocation}
        >
          <Text style={styles.locationFinText}>완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
