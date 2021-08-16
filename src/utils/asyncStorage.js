import AsyncStorage from "@react-native-community/async-storage";
import { KEY_VALUE1, KEY_VALUE2 } from "constant/const";

const setFirstSubmit = () => {
  AsyncStorage.setItem(KEY_VALUE1, "true");
};

const setGeofenceData = (array) => {
  AsyncStorage.setItem(KEY_VALUE2, array);
};

export const checkFirstSubmit = async () => {
  try {
    const isFirstLaunched = await AsyncStorage.getItem(KEY_VALUE1);
    if (isFirstLaunched === null) {
      setFirstSubmit();
      return true;
    }
    return false;
  } catch (error) {
    console.log(" [add first geofence] :" + error);
    return false;
  }
};

export const dbToAsyncStorage = async (todosRef, today) => {
  const geofenceDataArray = [];
  const sortedByStartTime = await todosRef
    .where("date", "==", `${today}`)
    .get();
  sortedByStartTime.forEach((result) => {
    geofenceDataArray.push({
      startTime: result.data().starttime,
      latitude: result.data().latitude,
      longitude: result.data().longitude,
    });
  });
  setGeofenceData(JSON.stringify(geofenceDataArray));
};
