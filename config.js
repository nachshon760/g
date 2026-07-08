require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
  SERVICE_ACCOUNT: require('./service-account.json'),
  BOTI_BASE_URL: 'https://api.360.boti.bot',   // <--- עדכון חשוב
  CHANNEL_ID: "35148",      // מה-URL שלך
  CHANNEL_HASH: "56e3ceb8"  // החלף בהאש המלא אם יש יותר תווים
};
