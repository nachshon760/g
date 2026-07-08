require('dotenv').config();
const express = require('express');
const cors = require('cors');
const config = require('./config');
const { getUserByApiKey, updateStars, addApiKeyToUser } = require('./googleSheets');
const { sendMessageToBoti } = require('./botiProxy');
const { generateApiKey } = require('./apiKeys');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Boti API Server is running 🚀');
});

// ======================
// 1. יצירת מפתח API חדש
app.post('/create-api-key', async (req, res) => {
  const { userId = "user_default", username = "unknown" } = req.body;
  
  const newKey = generateApiKey(67);
  
  // כאן נוסיף את המפתח לגיליון (בשורה הראשונה זמנית)
  // נשפר את זה בהמשך
  
  res.json({ 
    success: true, 
    apiKey: newKey,
    message: "מפתח נוצר בהצלחה" 
  });
});

// ======================
// 2. שליחת הודעה לבוט + חיוב כוכבים
app.post('/chat', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const { text, sessionId } = req.body;

  if (!apiKey) {
    return res.status(400).json({ error: "חסר מפתח API (x-api-key)" });
  }
  if (!text) {
    return res.status(400).json({ error: "חסר טקסט להודעה" });
  }

  // בדיקת משתמש ומפתח
  const user = await getUserByApiKey(apiKey);
  if (!user) {
    return res.status(401).json({ error: "מפתח API לא תקין" });
  }

  const messageLength = text.length;
  
  if (user.stars < messageLength) {
    return res.status(402).json({ 
      error: "אין מספיק כוכבים",
      currentStars: user.stars,
      needed: messageLength 
    });
  }

  try {
    // שליחה לבוטי
    const botResponse = await sendMessageToBoti(text, sessionId || "default_session");

    // עדכון כוכבים
    const newStars = user.stars - messageLength;
    await updateStars(user.rowIndex, newStars);

    res.json({
      success: true,
      response: botResponse,
      remainingStars: newStars,
      messageLength: messageLength
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "שגיאה בתקשורת עם הבוט" });
  }
});

const PORT = config.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
