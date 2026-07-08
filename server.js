require('dotenv').config();
const express = require('express');
const cors = require('cors');
const config = require('./config');
const { getUserByApiKey, updateStars } = require('./googleSheets');
const { sendMessageToBoti } = require('./botiProxy');
const { generateApiKey } = require('./apiKeys');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Boti API Server is running 🚀'));

// ======================
// 1. יצירת מפתח API חדש (לממשק שלך)
app.post('/create-api-key', async (req, res) => {
  const { userId, username } = req.body;
  const newKey = generateApiKey(config.API_KEY_LENGTH);
  
  // כאן תוסיף לוגיקה של כתיבה לגיליון
  res.json({ success: true, apiKey: newKey });
});

// ======================
// 2. שליחת הודעה לבוט + חיוב כוכבים
app.post('/chat', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const { text, sessionId } = req.body;

  if (!apiKey || !text) {
    return res.status(400).json({ error: "Missing apiKey or text" });
  }

  const user = await getUserByApiKey(apiKey);
  if (!user) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  const messageLength = text.length;
  if (user.stars < messageLength) {
    return res.status(402).json({ 
      error: "Not enough stars", 
      currentStars: user.stars,
      needed: messageLength 
    });
  }

  try {
    const botResponse = await sendMessageToBoti(text, sessionId);
    
    // הפחתת כוכבים
    const newStars = user.stars - messageLength;
    await updateStars(user.rowIndex, newStars);

    res.json({
      success: true,
      response: botResponse,
      remainingStars: newStars
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(config.PORT, () => {
  console.log(`✅ Server running on http://localhost:${config.PORT}`);
});
