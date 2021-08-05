import firebase from 'firebase';
import deviceInfoModule from 'react-native-device-info';
import { dbService } from '../firebase';

const uid = deviceInfoModule.getUniqueId();

export async function fetchToDo() {
  let isData = false;
  let arr = [];
  const rowData = await dbService.collection(`${uid}`).get();
  if (rowData.exists) {
    console.log('fetchdata');
    isData = true;
    rowData.forEach((doc) => arr.push(doc.data()));
  } else {
    isData = false;
    console.log('does not exists');
  }
  return isData;
}
