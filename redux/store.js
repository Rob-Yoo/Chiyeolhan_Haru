import { configureStore, createSlice } from "@reduxjs/toolkit";

const toDos = createSlice({
  name: "toDoReducer",
  initialState: {
    "01": {
      id: "01",
      title: "예시 테스트 1 자습",
      starttime: "11:00",
      finishtime: "12:00",
      location: "스타벅스 어디점",
      todo: ["영단어외우기", "커피마시기"],
      date: "0804",
    },
    "02": {
      id: "02",
      title: "예시 테스트 2 운동",
      starttime: "13:00",
      finishtime: "15:00",
      location: "어디학교 운동장",
      todo: ["운동상체", "끝내주게숨쉬기"],
      date: "0804",
    },
  },
  reducers: {
    create: (state, action) => {
      const [
        id,
        starttime,
        finishtime,
        title,
        date,
        location = "api로받아오기",
        longitude = "경도",
        latitude = "위도",
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
        todo: [],
      };
    },
    add: (state, action) => {
      const todoId = action.payload.id;
      const task = action.payload.task;
      state[todoId].todo.push(task);
    },
  },
});

const store = configureStore({ reducer: toDos.reducer });
export const { create, add } = toDos.actions;
export default store;
