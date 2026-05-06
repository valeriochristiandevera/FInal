const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/users.json');
const HISTORY_FILE = path.join(__dirname, '../data/history.json');
const UPLOADS_FILE = path.join(__dirname, '../data/uploads.json');
const COMMENTS_FILE = path.join(__dirname, '../data/comments.json');
const LIKES_FILE = path.join(__dirname, '../data/likes.json');
const UNLIKES_FILE = path.join(__dirname, '../data/unlikes.json');
const SUBSCRIPTIONS_FILE = path.join(__dirname, '../data/subscriptions.json');
const VIEWS_FILE = path.join(__dirname, '../data/views.json');

function readJSON(filePath, defaultValue = []) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
  }
  return defaultValue;
}

function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err.message);
  }
}

module.exports = {
  loadUsers: () => readJSON(USERS_FILE, []),
  saveUsers: (users) => writeJSON(USERS_FILE, users),
  loadHistory: () => readJSON(HISTORY_FILE, []),
  saveHistory: (history) => writeJSON(HISTORY_FILE, history),
  loadUploads: () => readJSON(UPLOADS_FILE, []),
  saveUploads: (uploads) => writeJSON(UPLOADS_FILE, uploads),
  loadComments: () => readJSON(COMMENTS_FILE, []),
  saveComments: (comments) => writeJSON(COMMENTS_FILE, comments),
  loadLikes: () => readJSON(LIKES_FILE, []),
  saveLikes: (likes) => writeJSON(LIKES_FILE, likes),
  loadUnlikes: () => readJSON(UNLIKES_FILE, []),
  saveUnlikes: (unlikes) => writeJSON(UNLIKES_FILE, unlikes),
  loadSubscriptions: () => readJSON(SUBSCRIPTIONS_FILE, []),
  saveSubscriptions: (subscriptions) => writeJSON(SUBSCRIPTIONS_FILE, subscriptions),
  loadViews: () => readJSON(VIEWS_FILE, []),
  saveViews: (views) => writeJSON(VIEWS_FILE, views),
};
