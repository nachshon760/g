const axios = require('axios');
const config = require('./config');

async function sendMessageToBoti(text, sessionId = null) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Origin': 'https://boti.bot',
      'Referer': 'https://boti.bot'
    };

    const payload = {
      type: "text",
      text: text,
      buttons: [],
      sessionId: sessionId
    };

    const response = await axios.post(config.BOTI_BASE_URL, payload, { headers });

    return response.data;

  } catch (error) {
    console.error("Boti API Error:", error.response ? error.response.data : error.message);
    throw new Error("שגיאה בתקשורת עם Boti");
  }
}

module.exports = { sendMessageToBoti };
