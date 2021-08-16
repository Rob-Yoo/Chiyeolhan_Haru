import DeviceInfo from 'react-native-device-info';

export const KEY_VALUE1 = 'isFirst';
export const KEY_VALUE2 = 'gefenceDataArray';
export const KEY_VALUE3 = 'isStop';
export const UID = DeviceInfo.getUniqueId();
export const GOOGLE_API_URL =
  'https://maps.googleapis.com/maps/api/place/findplacefromtext/json';
export const PLACES_PARAMS =
  'inputtype=textquery&language=ko&fields=formatted_address,name,geometry';
