import { combineReducers, configureStore, createSlice } from '@reduxjs/toolkit';

import { toDosUpdateDB, toDosDeleteDB } from 'utils/databaseUtil';

const toDosSlice = createSlice({
  name: 'toDoReducer',
  initialState: {},
  reducers: {
    init: (state, action) => {
      Object.assign(state, action.payload);
    },
    //투두 생성
    create: (state, action) => {
      const newData = action.payload;
      const id = action.payload.id;
      state[id] = newData;
    },
    //투두 추가
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
    //투두스킵
    skip: (state, action) => {
      const targetId = action.payload;
      state[targetId].isSkip = true;
    },
  },
});
const networkSlice = createSlice({
  name: 'networkReducer',
  initialState: null,
  reducers: {
    setNetwork: (state, action) => {
      return (state = action.payload);
    },
  },
});

const tabBarSlice = createSlice({
  name: 'tabBarReducer',
  initialState: null,
  reducers: {
    setTabBar: (state, action) => {
      return (state = action.payload);
    },
  },
});

const homeRenderSlice = createSlice({
  name: 'homeRenderReducer',
  initialState: false,
  reducers: {
    setHomeRender: (state, action) => {
      return (state = action.payload);
    },
  },
});

const reducer = combineReducers({
  toDos: toDosSlice.reducer,
  network: networkSlice.reducer,
  tabBar: tabBarSlice.reducer,
  homerender: homeRenderSlice.reducer,
});

export const {
  create,
  add,
  init,
  edit,
  remove,
  deleteToDoDispatch,
  editToDoDispatch,
  skip,
} = toDosSlice.actions;
export const { setNetwork } = networkSlice.actions;
export const { setTabBar } = tabBarSlice.actions;
export const { setHomeRender } = homeRenderSlice.actions;

export default configureStore({
  reducer,
});
