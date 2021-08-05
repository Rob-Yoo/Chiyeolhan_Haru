import { configureStore, createSlice } from '@reduxjs/toolkit';
import reduxSaga from 'redux-saga';

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
        location = 'api로받아오기',
        longitude = '경도',
        latitude = '위도',
      ] = action.payload;
      state[`${id}`] = {
        id,
        title,
        starttime,
        finishtime,
        location,
        longitude,
        latitude,
        date,
        todos: [],
      };
    },
    add: (state, action) => {
      const todoId = action.payload.id;
      const task = action.payload.task;
      state[todoId].todos.push(task);
    },
  },
});

const store = configureStore({ reducer: toDos.reducer });
export const { create, add, init } = toDos.actions;
export default store;
