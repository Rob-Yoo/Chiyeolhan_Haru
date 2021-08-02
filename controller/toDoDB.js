import React, { useEffect, useState } from 'react';
import deviceInfoModule from 'react-native-device-info';
import { dbService } from '../firebase';
const initToDoList = () => {
  //const [isGet, setGet] = useState(false);
  const [initToDo, setInitToDos] = useState({});

  useEffect(async () => {
    try {
      console.log('gettodo');
      const uid = deviceInfoModule.getUniqueId();
      const dbData = await dbService.collection(uid).get();
      dbData.forEach((doc) => setInitToDos(doc.data()));
      console.log(initToDo);
      setGet(true);
    } catch (e) {
      console.error(e.message);
    }
    console.log(initToDo);
    return { ...initToDo };
  }, []);
};
export default initToDoList;
