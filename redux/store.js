import { configureStore, createSlice } from '@reduxjs/toolkit';
import reduxSaga from 'redux-saga';

const toDos = createSlice({
  name: 'toDoReducer',
  initialState: [
    {
      id: '01',
      title: '예시 테스트 1 자습',
      starttime: '11:00',
      finishtime: '12:00',
      location: '스타벅스 어디점',
      todo: ['영단어외우기', '커피마시기'],
    },
    {
      id: '02',
      title: '예시 테스트 2 운동',
      starttime: '13:00',
      finishtime: '15:00',
      location: '어디학교 운동장',
      todo: ['운동상체', '끝내주게숨쉬기'],
    },
  ],
  reducers: {
    create: (state, action) => {
      console.log(action.payload);
      const [starttime, finishtime, title, location = 'api로받아오기'] =
        action.payload;
      state.push({
        id: Date.now(),
        title,
        starttime,
        finishtime,
        location,
        todo: [],
      });
    },
    add: (state, action) => {
      state[state.length - 1].todo.push(action.payload);
    },
  },
});

const store = configureStore({ reducer: toDos.reducer });
export const { create, add } = toDos.actions;
export default store;
