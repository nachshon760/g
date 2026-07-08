const crypto = require('crypto');

function generateApiKey(length = 67) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = '';
  for (let i = 0; i < length; i++) {
    key += chars.charAt(crypto.randomInt(chars.length));
  }
  return key;
}

module.exports = { generateApiKey };
