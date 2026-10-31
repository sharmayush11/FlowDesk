import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', userData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, accessToken: null, loading: false, error: null },
  reducers: {
    setToken: (state, action) => { state.accessToken = action.payload; },
    logout:   (state) => { state.user = null; state.accessToken = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending,    (s) => { s.loading = true; s.error = null; })
      .addCase(loginUser.fulfilled,  (s, a) => { s.loading = false; s.user = a.payload.user; s.accessToken = a.payload.accessToken; })
      .addCase(loginUser.rejected,   (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(registerUser.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(registerUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.accessToken = a.payload.accessToken; })
      .addCase(registerUser.rejected,  (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
