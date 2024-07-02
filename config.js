module.exports = {
  port: +process.env.PORT || 8080,
  storageFileName: process.env.STORAGE_FILE_NAME || '.data.json',
  passwordSecret: process.env.PASSWORD_SECRET || 'secret',
  tokenSecret: process.env.TOKEN_SECRET || '1234567891234567',
}
