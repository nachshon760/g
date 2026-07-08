const { google } = require('googleapis');

async function getAuth() {
  const config = require('./config');
  const auth = new google.auth.GoogleAuth({
    credentials: config.SERVICE_ACCOUNT,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

async function getUserByApiKey(apiKey) {
  const sheets = await getAuth();
  const config = require('./config');
  
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: config.GOOGLE_SHEET_ID,
    range: 'Sheet1!A:G', // התאם לטבלה שלך
  });

  const rows = res.data.values || [];
  // שורה 0 = כותרות
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][3] && rows[i][3].includes(apiKey)) { // עמודה D = מפתחות
      return {
        rowIndex: i + 1,
        userId: rows[i][0],
        username: rows[i][1],
        stars: parseInt(rows[i][2] || 0),
        apiKeys: rows[i][3] ? rows[i][3].split(',') : []
      };
    }
  }
  return null;
}

async function updateStars(rowIndex, newStars) {
  const sheets = await getAuth();
  const config = require('./config');
  
  await sheets.spreadsheets.values.update({
    spreadsheetId: config.GOOGLE_SHEET_ID,
    range: `Sheet1!C${rowIndex}`,
    valueInputOption: 'RAW',
    resource: { values: [[newStars]] }
  });
}

module.exports = { getUserByApiKey, updateStars };
