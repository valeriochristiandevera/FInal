import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/likes';

export const fetchLikes = createAsyncThunk('likes/fetch', async (videoId) => {
  const response = await axios.get(`${API_URL}?videoId=${videoId}`);
  return response.data;
});

export const toggleLike = createAsyncThunk('likes/toggle', async (videoId, { getState }) => {
  const { auth } = getState();
  const response = await axios.post(API_URL, { videoId }, {
    headers: { Authorization: `Bearer ${auth.token}` }
  });
  return response.data;
});

const likeSlice = createSlice({
  name: 'likes',
  initialState: {
    likes: [],
    count: 0,
    isLiked: false,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLikes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLikes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.count = action.payload.count || 0;
        state.likes = action.payload.likes || [];
        state.isLiked = action.payload.likes?.some(l => l.userId === action.payload.userId) || false;
      })
      .addCase(fetchLikes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.isLiked = action.payload.liked;
        state.count = action.payload.count;
      });
  },
});

export default likeSlice.reducer;
