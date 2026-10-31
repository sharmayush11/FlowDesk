import { configureStore } from '@reduxjs/toolkit';
import authReducer  from './slices/authSlice';
import boardReducer from './slices/boardSlice';
import taskReducer  from './slices/taskSlice';

const store = configureStore({
  reducer: {
    auth:   authReducer,
    boards: boardReducer,
    tasks:  taskReducer,
  },
});

export default store;
