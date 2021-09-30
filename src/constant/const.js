import { Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';

//async storage key
export const KEY_VALUE_TODAY = 'today';
export const KEY_VALUE_EARLY = 'isEarly';
export const KEY_VALUE_START_TIME = 'startTimePicker';
export const KEY_VALUE_PROGRESSING = 'progressingSchedule';

export const KEY_VALUE_GEOFENCE = 'geofenceDataArray';
export const KEY_VALUE_SUCCESS = 'geofenceSuccessArray';
export const KEY_VALUE_NEAR_BY = 'nearBySchedulesArray';
export const KEY_VALUE_SEARCHED = 'searchedDataArray';
export const KEY_VALUE_FAVORITE = 'favoriteDataArray';
export const KEY_VALUE_TODAY_DATA = 'todayDataArray';
export const KEY_VALUE_TOMORROW_DATA = 'tomorrowDataArray';
export const KEY_VALUE_YESTERDAY_DATA = 'yesterdayDataArray';

// 기기 고유 ID
export const UID = DeviceInfo.getUniqueId();

// Google Place API
export const GOOGLE_API_URL =
  'https://maps.googleapis.com/maps/api/place/findplacefromtext/json';
export const GOOGLE_PARARMS =
  'inputtype=textquery&language=ko&fields=formatted_address,name,geometry';

/*Layout */
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get('window');
export const CONTENT_OFFSET = 16;
export const CONTAINER_HEIGHT = SCREEN_HEIGHT - 20;
export const CONTAINER_WIDTH = SCREEN_WIDTH - 50;
