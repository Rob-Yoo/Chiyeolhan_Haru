import DeviceInfo from 'react-native-device-info';

export const KEY_VALUE_GEOFENCE = 'gefenceDataArray';
export const KEY_VALUE_SEARCHED = 'searchedDataArray';
export const KEY_VALUE_TOO_EARLY = 'isTooEarly';

export const UID = DeviceInfo.getUniqueId();

export const GOOGLE_API_URL =
  'https://maps.googleapis.com/maps/api/place/findplacefromtext/json';

export const GOOGLE_PARARMS =
  'inputtype=textquery&language=ko&fields=formatted_address,name,geometry';

const date = new Date();
export const YEAR = date.getFullYear();
export const MONTH = date.getMonth() + 1;
export const DAY = date.getDay();
export const TODAY =
  (date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1) +
  (date.getDay() < 10 ? `0${date.getDay()}` : date.getDay());
export const TOMORROW =
  (date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1) +
  (date.getDay() < 10 ? `0${date.getDay() + 1}` : date.getDay() + 1);
