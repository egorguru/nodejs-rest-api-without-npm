const utils = require('../utils')
const storage = require('../storage')
const config = require('../config')

exports.postUsersRegister = async (req, res) => {
  const body = JSON.parse(await utils.readRequestBody(req))
  if (body.username === undefined || body.password === undefined) {
    utils.sendJson(res, 400, { message: 'Bad Request' })
    return
  }
  const storageData = await storage.get()
  if (storageData.users[body.username] !== undefined) {
    utils.sendJson(res, 400, { message: `User.username='${body.username}' is already existed` })
    return
  }
  storageData.users[body.username] = {
    username: body.username,
    passwordHash: utils.hash(config.passwordSecret, body.password),
  }
  await storage.save(storageData)
  utils.sendJson(res, 200, { message: `User.username='${body.username}' has been created` })
}

exports.postUsersLogin = async (req, res) => {
  const body = JSON.parse(await utils.readRequestBody(req))
  if (body.username === undefined || body.password === undefined) {
    utils.sendJson(res, 400, { message: 'Bad Request' })
    return
  }
  const storageData = await storage.get()
  const user = storageData.users[body.username]
  if (user === undefined) {
    utils.sendJson(res, 400, { message: 'Wrong username or password' })
    return
  }
  const passwordHash = utils.hash(config.passwordSecret, body.password)
  if (passwordHash !== user.passwordHash) {
    utils.sendJson(res, 400, { message: 'Wrong username or password' })
    return
  }
  const tokenData = JSON.stringify({
    username: user.username,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 1 day
  })
  const token = utils.encrypt(config.tokenSecret, tokenData)
  utils.sendJson(res, 200, { token })
}
