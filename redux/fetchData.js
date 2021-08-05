import firebase from 'firebase';
import deviceInfoModule from 'react-native-device-info';
import { connect } from 'react-redux';
import { dbService } from '../firebase';

const uid = deviceInfoModule.getUniqueId();

export function fetchToDo(toDos, initToDo) {
  let rowObj = {};
  const docRef = dbService.collection(`${uid}`);

  docRef.get().then((doc) => {
    if (doc !== undefined) {
      console.log('fetchdata');
      isData = true;
      doc.forEach((data) => (rowObj[data.id] = data.data()));

      return rowObj;
    } else {
      isData = false;
      console.log('does not exists');
    }
    return rowObj;
  });
}

function mapStateToProps(state) {
  return { toDos: state };
}

function mapDispatchToProps(dispatch) {
  return {
    initToDo: (todo) => dispatch(init(todo)),
  };
}

export default connect(mapDispatchToProps, mapStateToProps)(fetchToDo);
