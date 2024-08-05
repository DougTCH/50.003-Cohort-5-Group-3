const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = Buffer.from('3B95YFLYE2LfBZqZ8CLbz5dIzKe90Fiw'); // Must be 32 bytes
const iv = Buffer.from('ABCSDDDSAWDDSAWD'); // Must be 16 bytes

function encrypt(text) {
  let cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(text) {
  let decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encrypt, decrypt };
