import { dbService } from 'utils/firebase';
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
