require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { loadUsers, saveUsers, loadHistory, saveHistory, loadUploads, saveUploads, loadComments, saveComments, loadLikes, saveLikes, loadUnlikes, saveUnlikes, loadSubscriptions, saveSubscriptions, loadViews, saveViews } = require('./utils/fileStore');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'youtube-v31.p.rapidapi.com';
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_env';

let users = loadUsers(); // Load from JSON file

if (!RAPIDAPI_KEY) {
  console.error('RAPIDAPI_KEY not set in .env');
  process.exit(1);
}

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: Date.now().toString(),
      email,
      password: hashedPassword
    };
    users.push(user);
    saveUsers(users);
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ user: { id: user.id, email }, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const user = users.find(u => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ user: { id: user.id, email }, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

let history = loadHistory(); // Load from JSON file
let uploads = loadUploads(); // Load uploads from JSON file
let comments = loadComments(); // Load comments from JSON file
let likes = loadLikes(); // Load likes from JSON file
let unlikes = loadUnlikes(); // Load unlikes from JSON file
let subscriptions = loadSubscriptions(); // Load subscriptions from JSON file
let views = loadViews(); // Load views from JSON file

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

app.get('/api/history', (req, res) => {
  res.json(history);
});

app.post('/api/history', (req, res) => {
  const { videoId, title, timestamp } = req.body;
  if (videoId && title) {
    history.unshift({ videoId, title, timestamp: timestamp || new Date().toISOString() });
    // Keep top 50
    if (history.length > 50) history = history.slice(0, 50);
    saveHistory(history);
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Missing videoId or title' });
  }
});

app.delete('/api/history/:videoId', (req, res) => {
  const { videoId } = req.params;
  const initialLength = history.length;
  history = history.filter((item) => item.videoId !== videoId);
  if (history.length < initialLength) {
    saveHistory(history);
    res.json({ success: true, history });
  } else {
    res.status(404).json({ error: 'History item not found' });
  }
});

app.delete('/api/history', (req, res) => {
  history = [];
  saveHistory(history);
  res.json({ success: true, history: [] });
});

// Upload endpoints
app.get('/api/upload', authenticateToken, (req, res) => {
  // Return uploads for logged-in user only
  const userUploads = uploads.filter(u => u.userId === req.user.userId);
  res.json(userUploads);
});

app.post('/api/upload', authenticateToken, (req, res) => {
  const { videoUrl, title, description } = req.body;
  if (!videoUrl) {
    return res.status(400).json({ error: 'Video URL required' });
  }
  // Extract video ID from YouTube URL
  let videoId = '';
  if (videoUrl.includes('v=')) {
    videoId = videoUrl.split('v=')[1].split('&')[0];
  } else if (videoUrl.includes('youtu.be/')) {
    videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
  } else {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }
  
  const upload = {
    id: Date.now().toString(),
    userId: req.user.userId,
    videoId,
    title: title || 'Untitled',
    description: description || '',
    url: videoUrl,
    createdAt: new Date().toISOString()
  };
  uploads.push(upload);
  saveUploads(uploads);
  res.json({ success: true, upload });
});

app.delete('/api/upload/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const initialLength = uploads.length;
  uploads = uploads.filter(u => u.id !== id || u.userId !== req.user.userId);
  if (uploads.length < initialLength) {
    saveUploads(uploads);
    res.json({ success: true, uploads });
  } else {
    res.status(404).json({ error: 'Upload not found' });
  }
});

// Comment endpoints
app.get('/api/comments', (req, res) => {
  const { videoId } = req.query;
  if (videoId) {
    const videoComments = comments.filter(c => c.videoId === videoId);
    res.json(videoComments);
  } else {
    res.json(comments);
  }
});

app.post('/api/comments', authenticateToken, (req, res) => {
  const { videoId, text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Comment text required' });
  }
  if (!videoId) {
    return res.status(400).json({ error: 'Video ID required' });
  }
  const comment = {
    id: Date.now().toString(),
    videoId,
    userId: req.user.userId,
    userEmail: users.find(u => u.id === req.user.userId)?.email || 'Anonymous',
    text,
    createdAt: new Date().toISOString()
  };
  comments.push(comment);
  saveComments(comments);
  res.json({ success: true, comment });
});

app.delete('/api/comments/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const initialLength = comments.length;
  comments = comments.filter(c => c.id !== id || c.userId !== req.user.userId);
  if (comments.length < initialLength) {
    saveComments(comments);
    res.json({ success: true, comments });
  } else {
    res.status(404).json({ error: 'Comment not found' });
  }
});

// Like endpoints
app.get('/api/likes', (req, res) => {
  const { videoId } = req.query;
  if (videoId) {
    const videoLikes = likes.filter(l => l.videoId === videoId);
    const count = videoLikes.length;
    res.json({ count, likes: videoLikes });
  } else {
    res.json(likes);
  }
});

app.post('/api/likes', authenticateToken, (req, res) => {
  const { videoId } = req.body;
  if (!videoId) {
    return res.status(400).json({ error: 'Video ID required' });
  }
  // Check if user already liked this video
  const existingLike = likes.find(l => l.videoId === videoId && l.userId === req.user.userId);
  if (existingLike) {
    // Unlike (remove like)
    likes = likes.filter(l => !(l.videoId === videoId && l.userId === req.user.userId));
    saveLikes(likes);
    res.json({ success: true, liked: false, count: likes.filter(l => l.videoId === videoId).length });
    return;
  }
  // Add like
  const like = {
    id: Date.now().toString(),
    videoId,
    userId: req.user.userId,
    createdAt: new Date().toISOString()
  };
  likes.push(like);
  saveLikes(likes);
  res.json({ success: true, liked: true, count: likes.filter(l => l.videoId === videoId).length });
});

app.delete('/api/likes/:videoId', authenticateToken, (req, res) => {
  const { videoId } = req.params;
  const initialLength = likes.length;
  likes = likes.filter(l => !(l.videoId === videoId && l.userId === req.user.userId));
  if (likes.length < initialLength) {
    saveLikes(likes);
    res.json({ success: true, likes });
  } else {
    res.status(404).json({ error: 'Like not found' });
  }
});

// Unlike endpoints
app.get('/api/unlikes', (req, res) => {
  const { videoId } = req.query;
  if (videoId) {
    const videoUnlikes = unlikes.filter(l => l.videoId === videoId);
    const count = videoUnlikes.length;
    res.json({ count, unlikes: videoUnlikes });
  } else {
    res.json(unlikes);
  }
});

app.post('/api/unlikes', authenticateToken, (req, res) => {
  const { videoId } = req.body;
  if (!videoId) {
    return res.status(400).json({ error: 'Video ID required' });
  }
  // Check if user already unliked this video
  const existingUnlike = unlikes.find(l => l.videoId === videoId && l.userId === req.user.userId);
  if (existingUnlike) {
    // Remove unlike
    unlikes = unlikes.filter(l => !(l.videoId === videoId && l.userId === req.user.userId));
    saveUnlikes(unlikes);
    res.json({ success: true, unliked: false, count: unlikes.filter(l => l.videoId === videoId).length });
    return;
  }
  // Add unlike
  const unlike = {
    id: Date.now().toString(),
    videoId,
    userId: req.user.userId,
    createdAt: new Date().toISOString()
  };
  unlikes.push(unlike);
  saveUnlikes(unlikes);
  res.json({ success: true, unliked: true, count: unlikes.filter(l => l.videoId === videoId).length });
});

app.delete('/api/unlikes/:videoId', authenticateToken, (req, res) => {
  const { videoId } = req.params;
  const initialLength = unlikes.length;
  unlikes = unlikes.filter(l => !(l.videoId === videoId && l.userId === req.user.userId));
  if (unlikes.length < initialLength) {
    saveUnlikes(unlikes);
    res.json({ success: true, unlikes });
  } else {
    res.status(404).json({ error: 'Unlike not found' });
  }
});

// Subscription endpoints
app.get('/api/subscriptions', (req, res) => {
  const { channelId } = req.query;
  if (channelId) {
    const channelSubscriptions = subscriptions.filter(s => s.channelId === channelId);
    const count = channelSubscriptions.length;
    res.json({ count, subscriptions: channelSubscriptions });
  } else {
    res.json(subscriptions);
  }
});

app.post('/api/subscriptions', authenticateToken, (req, res) => {
  const { channelId } = req.body;
  if (!channelId) {
    return res.status(400).json({ error: 'Channel ID required' });
  }
  // Check if user already subscribed to this channel
  const existingSubscription = subscriptions.find(s => s.channelId === channelId && s.userId === req.user.userId);
  if (existingSubscription) {
    // Unsubscribe (remove subscription)
    subscriptions = subscriptions.filter(s => !(s.channelId === channelId && s.userId === req.user.userId));
    saveSubscriptions(subscriptions);
    res.json({ success: true, subscribed: false, count: subscriptions.filter(s => s.channelId === channelId).length });
    return;
  }
  // Add subscription
  const subscription = {
    id: Date.now().toString(),
    channelId,
    userId: req.user.userId,
    createdAt: new Date().toISOString()
  };
  subscriptions.push(subscription);
  saveSubscriptions(subscriptions);
  res.json({ success: true, subscribed: true, count: subscriptions.filter(s => s.channelId === channelId).length });
});

app.delete('/api/subscriptions/:channelId', authenticateToken, (req, res) => {
  const { channelId } = req.params;
  const initialLength = subscriptions.length;
  subscriptions = subscriptions.filter(s => !(s.channelId === channelId && s.userId === req.user.userId));
  if (subscriptions.length < initialLength) {
    saveSubscriptions(subscriptions);
    res.json({ success: true, subscriptions });
  } else {
    res.status(404).json({ error: 'Subscription not found' });
  }
});

// View endpoints (doesn't require authentication - views are tracked for all visitors)
app.get('/api/views', (req, res) => {
  const { videoId, channelId } = req.query;
  if (videoId) {
    const videoViews = views.filter(v => v.videoId === videoId);
    const count = videoViews.length;
    res.json({ count, views: videoViews });
  } else if (channelId) {
    // Get total views for videos in a channel
    const channelViews = views.filter(v => v.channelId === channelId);
    const count = channelViews.length;
    res.json({ count, views: channelViews });
  } else {
    res.json(views);
  }
});

app.post('/api/views', (req, res) => {
  const { videoId, channelId } = req.body;
  if (!videoId) {
    return res.status(400).json({ error: 'Video ID required' });
  }
  // Add view (one view per video visit - we don't track user ID since views are open to all)
  const view = {
    id: Date.now().toString(),
    videoId,
    channelId: channelId || null,
    createdAt: new Date().toISOString()
  };
  views.push(view);
  saveViews(views);
  const count = views.filter(v => v.videoId === videoId).length;
  res.json({ success: true, count });
});

app.get('/api/:endpoint', async (req, res) => {
  try {
    const { endpoint } = req.params;
    const params = req.query;

    const response = await axios.get(`https://${RAPIDAPI_HOST}/${endpoint}`, {
      params,
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Proxy request failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('History endpoints: GET/POST /api/history');
});
