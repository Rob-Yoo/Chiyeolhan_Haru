import { dbService } from 'utils/firebaseUtil';
import { errorNotifAlert } from 'utils/buttonAlertUtil';

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
    errorNotifAlert(`toDosUpdateDB Error : ${e}`);
  }
};

export const toDosDeleteDB = async (id) => {
  try {
    await dbService.collection(`${UID}`).doc(`${id}`).delete();
  } catch (e) {
    errorNotifAlert(`toDosDeleteDB Error : ${e}`);
  }
};
