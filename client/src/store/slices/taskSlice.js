import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (boardId, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/tasks?boardId=${boardId}`);
    return data;
  } catch (err) { return rejectWithValue(err.response.data.message); }
});

export const createTask = createAsyncThunk('tasks/create', async (taskData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/tasks', taskData);
    return data;
  } catch (err) { return rejectWithValue(err.response.data.message); }
});

export const moveTask = createAsyncThunk('tasks/move', async ({ id, columnId, order }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/tasks/${id}/move`, { columnId, order });
    return data;
  } catch (err) { return rejectWithValue(err.response.data.message); }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, ...updates }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/tasks/${id}`, updates);
    return data;
  } catch (err) { return rejectWithValue(err.response.data.message); }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/tasks/${id}`);
    return id;
  } catch (err) { return rejectWithValue(err.response.data.message); }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    // Socket: live updates from other users
    socketTaskMoved:   (s, a) => { const i = s.items.findIndex(t => t._id === a.payload._id); if (i !== -1) s.items[i] = a.payload; },
    socketTaskCreated: (s, a) => { if (!s.items.find(t => t._id === a.payload._id)) s.items.push(a.payload); },
    socketTaskUpdated: (s, a) => { const i = s.items.findIndex(t => t._id === a.payload._id); if (i !== -1) s.items[i] = a.payload; },
    socketTaskDeleted: (s, a) => { s.items = s.items.filter(t => t._id !== a.payload); },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending,   (s) => { s.loading = true; })
      .addCase(fetchTasks.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchTasks.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(createTask.fulfilled, (s, a) => { s.items.push(a.payload); })
      .addCase(moveTask.fulfilled,   (s, a) => { const i = s.items.findIndex(t => t._id === a.payload._id); if (i !== -1) s.items[i] = a.payload; })
      .addCase(updateTask.fulfilled, (s, a) => { const i = s.items.findIndex(t => t._id === a.payload._id); if (i !== -1) s.items[i] = a.payload; })
      .addCase(deleteTask.fulfilled, (s, a) => { s.items = s.items.filter(t => t._id !== a.payload); });
  },
});

export const { socketTaskMoved, socketTaskCreated, socketTaskUpdated, socketTaskDeleted } = taskSlice.actions;
export default taskSlice.reducer;
