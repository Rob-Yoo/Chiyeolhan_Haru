import { Dimensions, PixelRatio } from 'react-native';
import DeviceInfo from 'react-native-device-info';

//async storage key
export const KEY_VALUE_TODAY = 'today';
export const KEY_VALUE_DAY_CHANGE = 'isDayChange';
export const KEY_VALUE_START_TODO = 'startTodo';
export const KEY_VALUE_EARLY = 'isEarly';
export const KEY_VALUE_START_TIME = 'startTimePicker';
export const KEY_VALUE_PROGRESSING = 'progressingSchedule';
export const KEY_VALUE_INSTALLED = 'isInstalled';
export const KEY_VALUE_LAUNCH_BG = 'didLaunchInBackGround';

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

export const KAKAO_API_URL =
  'https://dapi.kakao.com/v2/local/search/keyword.json';
/*Layout */
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get('window');
export const CONTENT_OFFSET = 16;
export const CONTAINER_HEIGHT = SCREEN_HEIGHT - 20;
export const CONTAINER_WIDTH = SCREEN_WIDTH - 50;
export const ratio = PixelRatio.get();
