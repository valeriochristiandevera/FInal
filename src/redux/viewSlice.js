import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/views';

export const fetchViews = createAsyncThunk('views/fetch', async (videoId) => {
  const response = await axios.get(`${API_URL}?videoId=${videoId}`);
  return response.data;
});

export const fetchChannelViews = createAsyncThunk('views/fetchChannel', async (channelId) => {
  const response = await axios.get(`${API_URL}?channelId=${channelId}`);
  return response.data;
});

export const incrementView = createAsyncThunk('views/increment', async ({ videoId, channelId }) => {
  const response = await axios.post(API_URL, { videoId, channelId });
  return response.data;
});

const viewSlice = createSlice({
  name: 'views',
  initialState: {
    views: [],
    count: 0,
    channelCount: 0,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchViews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchViews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.count = action.payload.count || 0;
        state.views = action.payload.views || [];
      })
      .addCase(fetchViews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchChannelViews.fulfilled, (state, action) => {
        state.channelCount = action.payload.count || 0;
      })
      .addCase(incrementView.fulfilled, (state, action) => {
        state.count = action.payload.count;
      });
  },
});

export default viewSlice.reducer;
