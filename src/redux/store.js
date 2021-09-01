import { configureStore, createSlice } from '@reduxjs/toolkit';
import { toDosUpdateDB } from 'utils/Database';

const toDosSlice = createSlice({
  name: 'toDoReducer',
  initialState: {},
  reducers: {
    init: (state, action) => {
      Object.assign(state, action.payload);
    },
    create: (state, action) => {
      const [
        id,
        startTime,
        finishTime,
        title,
        date,
        toDos,
        address,
        longitude,
        latitude,
        location,
        isDone = false,
        isFavorite = false,
      ] = action.payload;
      state[`${id}`] = {
        id,
        startTime,
        finishTime,
        title,
        date,
        location,
        longitude,
        latitude,
        location,
        address,
        isDone,
        isfavorite: isFavorite,
        toDos: [...toDos],
      };
    },
    add: (state, action) => {
      const { targetId, taskTitle } = action.payload;
      state[targetId].toDos.push(taskTitle);
      toDosUpdateDB(state[targetId], targetId);
    },
    edit: (state, action) => {
      const { targetId, taskTitle, index } = action.payload;
      state[targetId].toDos[index] = taskTitle;
      toDosUpdateDB(state[targetId], targetId);
    },
    //수행리스트 제거
    remove: (state, action) => {
      const { targetId, index } = action.payload;
      state[targetId].toDos.splice(index, 1);
    },
    //투두 제거
    deleteToDoDispatch: (state, action) => {
      const targetId = action.payload;
      delete state[`${targetId}`];
    },
  },
});

export const { create, add, init, edit, remove, deleteToDoDispatch } =
  toDosSlice.actions;
export default configureStore({ reducer: toDosSlice.reducer });
