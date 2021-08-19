import { configureStore, createSlice } from '@reduxjs/toolkit';

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
      const todoId = action.payload.id;
      const task = action.payload.task;
      state[todoId].toDos.push(task);
    },
  },
});

export const { create, add, init } = toDosSlice.actions;
export default configureStore({ reducer: toDosSlice.reducer });
