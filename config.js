require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
  SERVICE_ACCOUNT: require('./service-account.json'), // שים את הקובץ שנתת לי כאן
  BOTI_BASE_URL: 'https://boti.bot',
  API_KEY_LENGTH: 67
};
