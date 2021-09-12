import { configureStore, createSlice } from '@reduxjs/toolkit';
import { toDosUpdateDB, toDosDeleteDB } from 'utils/Database';

const toDosSlice = createSlice({
  name: 'toDoReducer',
  initialState: {},
  reducers: {
    init: (state, action) => {
      Object.assign(state, action.payload);
    },
    create: (state, action) => {
      const newData = action.payload;
      const id = action.payload.id;
      state[id] = newData;
      toDosUpdateDB(newData, id);
    },
    add: (state, action) => {
      const { targetId, taskTitle } = action.payload;
      state[targetId].toDos.push(taskTitle);
      toDosUpdateDB(state[targetId], targetId);
    },
    //수행리스트 수정
    edit: (state, action) => {
      const { targetId, taskTitle, index } = action.payload;
      state[targetId].toDos[index] = taskTitle;
      toDosUpdateDB(state[targetId], targetId);
    },
    //투두 수정
    editToDoDispatch: (state, action) => {
      const {
        taskList,
        todoFinishTime,
        todoStartTime,
        todoTitle,
        id: targetId,
      } = action.payload;
      state[targetId].finishTime = todoFinishTime;
      state[targetId].startTime = todoStartTime;
      state[targetId].title = todoTitle;
      state[targetId].toDos = [...taskList];
      toDosUpdateDB(state[targetId], targetId);
    },
    //수행리스트 제거
    remove: (state, action) => {
      const { targetId, index } = action.payload;
      const todos = state[targetId].toDos;
      state[targetId].toDos = todos.filter((item, i) => i !== index);
      toDosUpdateDB(state[targetId], targetId);
    },
    //투두 제거
    deleteToDoDispatch: (state, action) => {
      const targetId = action.payload;
      delete state[targetId];
      toDosDeleteDB(targetId);
    },
  },
});

export const {
  create,
  add,
  init,
  edit,
  remove,
  deleteToDoDispatch,
  editToDoDispatch,
} = toDosSlice.actions;
export default configureStore({ reducer: toDosSlice.reducer });
