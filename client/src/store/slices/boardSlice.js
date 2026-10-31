import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import api from '../../api/axios';

export const fetchBoards = createAsyncThunk('boards/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/boards');
    return data;
  } catch (err) { return rejectWithValue(err.response.data.message); }
});

export const createBoard = createAsyncThunk('boards/create', async (boardData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/boards', boardData);
    return data;
  } catch (err) { return rejectWithValue(err.response.data.message); }
});

export const deleteBoard = createAsyncThunk('boards/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/boards/${id}`);
    return id;
  } catch (err) { return rejectWithValue(err.response.data.message); }
});

const boardSlice = createSlice({
  name: 'boards',
  initialState: { items: [], current: null, loading: false, error: null },
  reducers: {
    setCurrentBoard: (state, action) => { state.current = action.payload; },
    updateBoardSocket: (state, action) => {
      const idx = state.items.findIndex(b => b._id === action.payload._id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending,   (s) => { s.loading = true; })
      .addCase(fetchBoards.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchBoards.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(createBoard.fulfilled, (s, a) => { s.items.unshift(a.payload); })
      .addCase(deleteBoard.fulfilled, (s, a) => { s.items = s.items.filter(b => b._id !== a.payload); });
  },
});

export const { setCurrentBoard, updateBoardSocket } = boardSlice.actions;
export default boardSlice.reducer;
