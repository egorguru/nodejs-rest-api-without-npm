const health = require('./health')
const users = require('./users')
const articles = require('./articles')

module.exports = {
  '/health': {
    'GET': health.getHealth,
  },
  '/users/register': {
    'POST': users.postUsersRegister,
  },
  '/users/login': {
    'POST': users.postUsersLogin,
  },
  '/articles': {
    'POST': articles.postArticles,
    'GET': articles.getArticles,
    'PUT': articles.putArticles,
    'DELETE': articles.deleteArticles,
  },
  '/articles/id': {
    'GET': articles.getArticleById,
  },
}
