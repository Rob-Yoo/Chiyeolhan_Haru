import AsyncStorage from "@react-native-community/async-storage";

const KEY_VALUE = "isFirst";

// 키값에 true로 저장한다.
const setFirstSubmit = () => {
  AsyncStorage.setItem(KEY_VALUE, "true");
};

export const checkFirstSubmit = async () => {
  try {
    const isFirstLaunched = await AsyncStorage.getItem(KEY_VALUE);
    if (isFirstLaunched === null) {
      setFirstSubmit();
      return true;
    }
    return false;
  } catch (error) {
    console.log(" [chk first geofence] :" + error);
    return false;
  }
};