const utils = require('../utils')

exports.getHealth = (req, res) => {
  utils.sendJson(res, 200, { message: 'OK' })
}
