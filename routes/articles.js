const config = require('../config')
const storage = require('../storage')
const utils = require('../utils')

exports.postArticles = async (req, res) => {
  const auth = utils.checkAuth(config.tokenSecret, req.headers.authorization)
  if (auth === false) {
    utils.sendJson(res, 401, { message: 'Not Authorized' })
    return
  }
  const body = JSON.parse(await utils.readRequestBody(req))
  if (body.title === undefined || body.content === undefined || body.date === undefined) {
    utils.sendJson(res, 400, { message: 'Bad Request' })
    return
  }
  const articleId = utils.randomString()
  const article = {
    id: articleId,
    title: body.title,
    content: body.content,
    date: body.date,
    user: auth.username,
  }
  const storageData = await storage.get()
  storageData.articles[articleId] = article
  await storage.save(storageData)
  utils.sendJson(res, 201, article)
}

exports.getArticles = async (req, res, url) => {
  const page = +url.searchParams.get('page') || 1
  const limit = +url.searchParams.get('limit') || 10
  const storageData = await storage.get()
  const result = Object.values(storageData.articles).slice((page - 1) * limit, page * limit)
  utils.sendJson(res, 200, result)
}

exports.putArticles = async (req, res) => {
  const auth = utils.checkAuth(config.tokenSecret, req.headers.authorization)
  if (auth === false) {
    utils.sendJson(res, 401, { message: 'Not Authorized' })
    return
  }
  const body = JSON.parse(await utils.readRequestBody(req))
  if (body.id === undefined ||
    body.title === undefined ||
    body.content === undefined ||
    body.date === undefined) {
    utils.sendJson(res, 400, { message: 'Bad Request' })
    return
    }
  const storageData = await storage.get()
  const article = storageData.articles[body.id]
  if (article === undefined) {
    utils.sendJson(res, 404, { message: `Article.id='${body.id}' not found` })
    return
  }
  if (article.user !== auth.username) {
    utils.sendJson(res, 403, { message: 'Permission Denied' })
    return
  }
  storageData.articles[body.id] = {
    id: body.id,
    title: body.title,
    content: body.content,
    date: body.date,
    user: auth.username,
  }
  await storage.save(storageData)
  utils.sendJson(res, 200, body)
}

exports.deleteArticles = async (req, res, url) => {
  const auth = utils.checkAuth(config.tokenSecret, req.headers.authorization)
  if (auth === false) {
    utils.sendJson(res, 401, { message: 'Not Authorized' })
    return
  }
  const articleId = url.searchParams.get('id')
  if (articleId === null) {
    utils.sendJson(res, 400, { message: 'Bad Request' })
    return
  }
  const storageData = await storage.get()
  const article = storageData.articles[articleId]
  if (article === undefined) {
    utils.sendJson(res, 404, { message: `Article.id='${articleId}' not found` })
    return
  }
  if (article.user !== auth.username) {
    utils.sendJson(res, 403, { message: 'Permission Denied' })
    return
  }
  delete storageData.articles[articleId]
  await storage.save(storageData)
  utils.sendJson(res, 200, { message: 'Article has been successfully deleted' })
}

exports.getArticleById = async (req, res, url) => {
  const articleId = url.searchParams.get('id')
  if (articleId === null) {
    utils.sendJson(res, 400, { message: 'Bad Request' })
    return
  }
  const storageData = await storage.get()
  const article = storageData.articles[articleId]
  if (article === undefined) {
    utils.sendJson(res, 404, { message: 'Not Found' })
    return
  }
  utils.sendJson(res, 200, article)
}
