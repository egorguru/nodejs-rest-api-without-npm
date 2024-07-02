const fs = require('node:fs')

const config = require('./config')

if (!fs.existsSync(config.storageFileName)) {
  fs.writeFileSync(config.storageFileName, JSON.stringify({
    users: {},
    articles: {},
  }, undefined, 2))
}

exports.get = async () => {
  const data = await fs.promises.readFile(config.storageFileName)
  return JSON.parse(data)
}

exports.save = async data => {
  await fs.promises.writeFile(config.storageFileName, JSON.stringify(data, undefined, 2))
}
