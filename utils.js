const crypto = require('node:crypto')

exports.sendJson = (res, status, body) => {
  res.writeHead(status, { 'content-type': 'application/json' })
  res.end(JSON.stringify(body))
}

exports.readRequestBody = req => new Promise(resolve => {
  let buffer = ''
  req.on('data', chunk => {
    buffer += chunk
  })
  req.on('end', () => resolve(buffer))
})

exports.hash = (secret, string) => {
  return crypto.createHmac('sha256', secret).update(string).digest('hex')
}

exports.encrypt = (secret, string) => {
  const cipher = crypto.createCipheriv('aes-128-cbc', secret, Buffer.alloc(16))
  return cipher.update(string, undefined, 'base64') + cipher.final('base64')
}

exports.decrypt = (secret, string) => {
  const decipher = crypto.createDecipheriv('aes-128-cbc', secret, Buffer.alloc(16))
  const buffer = Buffer.concat([
    decipher.update(string, 'base64'),
    decipher.final(),
  ])
  return buffer.toString()
}

exports.checkAuth = (tokenSecret, token) => {
  let tokenData
  try {
    tokenData = JSON.parse(exports.decrypt(tokenSecret, token))
  } catch {
    return false
  }
  if (tokenData.expiresAt < Date.now()) {
    return false
  }
  return tokenData
}

exports.randomString = () => crypto.randomBytes(10).toString('hex')
