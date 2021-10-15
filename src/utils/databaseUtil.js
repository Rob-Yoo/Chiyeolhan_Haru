import { dbService } from 'utils/firebaseUtil';

import { UID } from 'constant/const';

export const toDosUpdateDB = async (newData, id) => {
  try {
    await dbService
      .collection(`${UID}`)
      .doc(`${id}`)
      .set({
        ...newData,
      });
  } catch (e) {
    console.log(('toDosUpdateDB Error :', e));
  }
};

export const toDosDeleteDB = async (id) => {
  try {
    await dbService.collection(`${UID}`).doc(`${id}`).delete();
  } catch (e) {
    console.log(('toDosDeleteDB Error :', e));
  }
};
