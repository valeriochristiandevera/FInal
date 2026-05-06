import { configureStore } from "@reduxjs/toolkit";
import categorySlice from "./redux/categorySlice";
import channelSlice from "./redux/channelSlice";
import searchSlice from "./redux/searchSlice";
import videoSlice from "./redux/videoSlice";
import historySlice from "./redux/historySlice";
import authSlice from "./redux/authSlice";
import commentSlice from "./redux/commentSlice";
import likeSlice from "./redux/likeSlice";
import unlikeSlice from "./redux/unlikeSlice";
import subscriptionSlice from "./redux/subscriptionSlice";
import viewSlice from "./redux/viewSlice";
const store = configureStore({
  reducer: {
    category: categorySlice,
    channel: channelSlice,
    video: videoSlice,
    search: searchSlice,
    history: historySlice,
    auth: authSlice,
    comments: commentSlice,
    likes: likeSlice,
    unlikes: unlikeSlice,
    subscriptions: subscriptionSlice,
    views: viewSlice,
  },
});
export default store;
