import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  history: [],
  isLoading: false,
  error: null,
};

export const getHistory = createAsyncThunk(
  "history/getHistory",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/history");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch history");
    }
  }
);

export const addToHistory = createAsyncThunk(
  "history/addToHistory",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/history", payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add to history");
    }
  }
);

export const removeFromHistory = createAsyncThunk(
  "history/removeFromHistory",
  async (videoId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`http://localhost:5000/api/history/${videoId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to remove from history");
    }
  }
);

export const clearAllHistory = createAsyncThunk(
  "history/clearAllHistory",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete("http://localhost:5000/api/history");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to clear history");
    }
  }
);

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    clearHistory: (state) => {
      state.history = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // getHistory
      .addCase(getHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getHistory.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.history = payload;
      })
      .addCase(getHistory.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // addToHistory
      .addCase(addToHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToHistory.fulfilled, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(addToHistory.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // removeFromHistory
      .addCase(removeFromHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromHistory.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.history = payload.history;
      })
      .addCase(removeFromHistory.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      // clearAllHistory
      .addCase(clearAllHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearAllHistory.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.history = payload.history;
      })
      .addCase(clearAllHistory.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });
  },
});

export const { clearHistory } = historySlice.actions;
export default historySlice.reducer;
