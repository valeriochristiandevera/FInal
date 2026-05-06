import {
  ChannelDetails,
  Feed,
  SearchFeed,
  Sidebar,
  VideoDetails,
  History,
  Login,
  Register,
  Profile,
  Settings,
  Upload,
} from "./pages/index";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/feed/:id" element={<Feed />} />
        <Route path="/channel/:id" element={<ChannelDetails />} />
        <Route path="/search/:id" element={<SearchFeed />} />
        <Route path="/watch/:id" element={<VideoDetails />} />
        <Route path="/history" element={<History />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
<Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </Router>
  );
}

export default App;
