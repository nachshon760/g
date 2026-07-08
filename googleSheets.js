const { google } = require('googleapis');
const config = require('./config');

async function getAuth() {
  const auth = new google.auth.GoogleAuth({
    credentials: config.SERVICE_ACCOUNT,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

// קבלת משתמש לפי מפתח API
async function getUserByApiKey(apiKey) {
  const sheets = await getAuth();
  
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: config.GOOGLE_SHEET_ID,
    range: 'Sheet1!A:C',   // A = User ID, B = Stars, C = API Keys
  });

  const rows = res.data.values || [];
  
  for (let i = 1; i < rows.length; i++) {   // מתחילים משורה 2
    const row = rows[i];
    const existingKeys = row[2] ? row[2].toString().split(',').map(k => k.trim()) : [];
    
    if (existingKeys.includes(apiKey)) {
      return {
        rowIndex: i + 1,
        userId: row[0] || `user_${i}`,
        stars: parseInt(row[1] || 0),
        apiKeys: existingKeys
      };
    }
  }
  return null;
}

// עדכון כמות הכוכבים
async function updateStars(rowIndex, newStars) {
  const sheets = await getAuth();
  
  await sheets.spreadsheets.values.update({
    spreadsheetId: config.GOOGLE_SHEET_ID,
    range: `Sheet1!B${rowIndex}`,
    valueInputOption: 'RAW',
    resource: { values: [[newStars]] }
  });
}

// הוספת מפתח חדש למשתמש (לשימוש בעתיד)
async function addApiKeyToUser(rowIndex, newApiKey) {
  const sheets = await getAuth();
  
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: config.GOOGLE_SHEET_ID,
    range: `Sheet1!C${rowIndex}`,
  });

  let currentKeys = res.data.values?.[0]?.[0] || '';
  let newKeys = currentKeys ? `${currentKeys},${newApiKey}` : newApiKey;

  await sheets.spreadsheets.values.update({
    spreadsheetId: config.GOOGLE_SHEET_ID,
    range: `Sheet1!C${rowIndex}`,
    valueInputOption: 'RAW',
    resource: { values: [[newKeys]] }
  });
}

module.exports = { getUserByApiKey, updateStars, addApiKeyToUser };
