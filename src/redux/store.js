import { configureStore, createSlice } from '@reduxjs/toolkit';

const toDos = createSlice({
  name: 'toDoReducer',
  initialState: {},
  reducers: {
    init: (state, action) => {
      //state = { ...action.payload };
      Object.assign(state, action.payload);
    },
    create: (state, action) => {
      const [
        id,
        starttime,
        finishtime,
        title,
        date,
        todos,
        address,
        longitude,
        latitude,
        location,
        isdone = false,
        isfavorite = false,
      ] = action.payload;
      state[`${id}`] = {
        id,
        starttime,
        finishtime,
        title,
        date,
        location,
        longitude,
        latitude,
        location,
        address,
        isdone,
        isfavorite,
        todos: [...todos],
      };
    },
    add: (state, action) => {
      const todoId = action.payload.id;
      const task = action.payload.task;
      state[todoId].todos.push(task);
    },
  },
});

export const { create, add, init } = toDos.actions;
export default configureStore({ reducer: toDos.reducer });
