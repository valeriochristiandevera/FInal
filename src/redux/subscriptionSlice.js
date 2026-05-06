import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/subscriptions';

export const fetchSubscriptions = createAsyncThunk('subscriptions/fetch', async (channelId) => {
  const response = await axios.get(`${API_URL}?channelId=${channelId}`);
  return response.data;
});

export const toggleSubscription = createAsyncThunk('subscriptions/toggle', async (channelId, { getState }) => {
  const { auth } = getState();
  const response = await axios.post(API_URL, { channelId }, {
    headers: { Authorization: `Bearer ${auth.token}` }
  });
  return response.data;
});

const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState: {
    subscriptions: [],
    count: 0,
    isSubscribed: false,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.count = action.payload.count || 0;
        state.subscriptions = action.payload.subscriptions || [];
        state.isSubscribed = action.payload.subscriptions?.some(s => s.userId === action.payload.userId) || false;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(toggleSubscription.fulfilled, (state, action) => {
        state.isSubscribed = action.payload.subscribed;
        state.count = action.payload.count;
      });
  },
});

export default subscriptionSlice.reducer;
