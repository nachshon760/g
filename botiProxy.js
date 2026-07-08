const axios = require('axios');
const config = require('./config');

async function sendMessageToBoti(text, sessionId) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Origin': 'https://boti.bot',
      'Referer': 'https://boti.bot'
    };

    const response = await axios.post(`${config.BOTI_BASE_URL}/api/conversations/${config.CHANNEL_ID}/send`, {
      type: "text",
      text: text,
      buttons: [],
      sessionId: sessionId
    }, { headers });

    return response.data;

  } catch (error) {
    console.error("Boti Error:", error.message);
    if (error.response) console.error(error.response.data);
    throw new Error("שגיאה בתקשורת עם Boti");
  }
}

module.exports = { sendMessageToBoti };
