import DeviceInfo from 'react-native-device-info';

//async storage key
export const KEY_VALUE_GEOFENCE = 'geofenceDataArray';
export const KEY_VALUE_NEAR_BY = 'nearBySchedulesArray';
export const KEY_VALUE_TOMORROW = 'tomorrowDataArray';
export const KEY_VALUE_TODAY = 'todayDataArray';
export const KEY_VALUE_START_TIME = 'startTimePicker';
export const KEY_VALUE_SEARCHED = 'searchedDataArray';
// 기기 고유 ID
export const UID = DeviceInfo.getUniqueId();

// Google Place API
export const GOOGLE_API_URL =
  'https://maps.googleapis.com/maps/api/place/findplacefromtext/json';
export const GOOGLE_PARARMS =
  'inputtype=textquery&language=ko&fields=formatted_address,name,geometry';

// Date 관련
const date = new Date();
const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
const min =
  date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
export const YEAR = date.getFullYear();
export const MONTH = date.getMonth() + 1;
export const DAY = date.getDate();
export const TODAY =
  (MONTH < 10 ? `0${MONTH}` : MONTH) + (DAY < 10 ? `0${DAY}` : DAY);
export const TOMORROW =
  (MONTH < 10 ? `0${MONTH}` : MONTH) + (DAY + 1 < 10 ? `0${DAY + 1}` : DAY + 1);
