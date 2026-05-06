import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/comments';

export const fetchComments = createAsyncThunk('comments/fetch', async (videoId) => {
  const response = await axios.get(`${API_URL}?videoId=${videoId}`);
  return response.data;
});

export const addComment = createAsyncThunk('comments/add', async ({ videoId, text }, { getState }) => {
  const { auth } = getState();
  const response = await axios.post(API_URL, { videoId, text }, {
    headers: { Authorization: `Bearer ${auth.token}` }
  });
  return response.data.comment;
});

export const deleteComment = createAsyncThunk('comments/delete', async (id, { getState }) => {
  const { auth } = getState();
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${auth.token}` }
  });
  return id;
});

const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(c => c.id !== action.payload);
      });
  },
});

export default commentSlice.reducer;
