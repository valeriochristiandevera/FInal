import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/unlikes';

export const fetchUnlikes = createAsyncThunk('unlikes/fetch', async (videoId) => {
  const response = await axios.get(`${API_URL}?videoId=${videoId}`);
  return response.data;
});

export const toggleUnlike = createAsyncThunk('unlikes/toggle', async (videoId, { getState }) => {
  const { auth } = getState();
  const response = await axios.post(API_URL, { videoId }, {
    headers: { Authorization: `Bearer ${auth.token}` }
  });
  return response.data;
});

const unlikeSlice = createSlice({
  name: 'unlikes',
  initialState: {
    unlikes: [],
    count: 0,
    isUnliked: false,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnlikes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUnlikes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.count = action.payload.count || 0;
        state.unlikes = action.payload.unlikes || [];
        state.isUnliked = action.payload.unlikes?.some(l => l.userId === action.payload.userId) || false;
      })
      .addCase(fetchUnlikes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(toggleUnlike.fulfilled, (state, action) => {
        state.isUnliked = action.payload.unliked;
        state.count = action.payload.count;
      });
  },
});

export default unlikeSlice.reducer;
