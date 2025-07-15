const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected!'))
.catch((err) => console.error(err));

app.use(express.json());

// Mongoose Player model
const Player = mongoose.model("Player", new mongoose.Schema({
  name: String
}));

// Serve static files (html, css, js)
const parentDir = path.join(__dirname, '..');
app.use(express.static(parentDir));

// Home page
app.get('/', (req, res) => {
  const filePath = path.join(parentDir, 'home.html');
  console.log('👉 Sending:', filePath);
  res.sendFile(filePath);
});

// Game page
app.get('/game', (req, res) => {
  const filePath = path.join(parentDir, 'index.html');
  console.log('👉 Sending:', filePath);
  res.sendFile(filePath);
});

// Save player name
app.post("/api/saveName", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: "Name is required." });
  }
  try {
    const player = new Player({ name });
    await player.save();
    console.log("✅ Saved player:", name);
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(5000, () => {
  console.log(`✅ Server running on http://localhost:5000`);
});
