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
        isdone: isDone,
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
    remove: (state, action) => {
      const { targetId, index } = action.payload;
      state[targetId].toDos.splice(index, 1);
    },
  },
});

export const { create, add, init, edit, remove } = toDosSlice.actions;
export default configureStore({ reducer: toDosSlice.reducer });
