const http = require('node:http')
const url = require('node:url')

const config = require('./config')
const utils = require('./utils')
const routes = require('./routes')

const server = http.createServer((req, res) => {
  try {
    const parsedUrl = new url.URL(req.url, `http://${req.headers.host}`)
    const handler = routes[parsedUrl.pathname]?.[req.method]
    if (handler === undefined) {
      utils.sendJson(res, 404, { message: 'Not Found' })
      return
    }
    handler(req, res, parsedUrl)
  } catch (e) {
    console.log(e)
    utils.sendJson(res, 500, { message: 'Internal Server Error' })
  }
})

server.listen(config.port, () => console.log(`Server has been started on port ${config.port}`))
