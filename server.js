const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;


// Set up database
const db = new sqlite3.Database('forum.db');
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve HTML
// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


// API: Get all posts
app.get('/api/posts', (req, res) => {
  db.all(`SELECT * FROM posts ORDER BY created_at DESC`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API: Add a post
app.post('/api/posts', (req, res) => {
  const { name, message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required.' });
  const safeName = name || 'Anonymous';
  db.run(`INSERT INTO posts (name, message) VALUES (?, ?)`, [safeName, message], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name: safeName, message });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Forum app listening at http://localhost:${port}`);
});
