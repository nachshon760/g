const axios = require('axios');
const config = require('./config');

async function createNewSession(channelId, channelHash) {
  // כאן תוסיף את הלוגיקה של יצירת sessionId חדש אם צריך
  // לעת עתה נניח שהמשתמש שולח sessionId, או שנשמור אותו
  console.log('Session creation not fully implemented yet');
  return null;
}

async function sendMessageToBoti(text, sessionId) {
  try {
    const response = await axios.post(config.BOTI_BASE_URL, {
      type: "text",
      text: text,
      buttons: [],
      sessionId: sessionId
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Boti API Error:', error.message);
    throw new Error('Failed to communicate with Boti');
  }
}

module.exports = { sendMessageToBoti };
