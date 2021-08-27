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
export const DAY = date.getDate();
export const TODAY =
  (MONTH < 10 ? `0${MONTH}` : MONTH) + (DAY < 10 ? `0${DAY}` : DAY);
export const TOMORROW =
  (MONTH < 10 ? `0${MONTH}` : MONTH) + (DAY < 10 ? `0${DAY + 1}` : DAY + 1);
