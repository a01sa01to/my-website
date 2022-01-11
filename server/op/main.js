'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const express_1 = __importDefault(require('express'))
const fs_1 = __importDefault(require('fs'))
const path_1 = __importDefault(require('path'))
const notAllowed_1 = __importDefault(require('./notAllowed'))
const opendata_1 = require('./opendata')
const port = process.env.PORT || 3000
const app = (0, express_1.default)()
const new_dirname = path_1.default.join(__dirname, '..', '..')
app.set('json spaces', 2)
app.use((req, res) => {
  if (req.hostname.startsWith('www')) {
    res.redirect(301, `https://a01sa01to.com${req.path}`)
    return
  }
  console.log(req.path)
  for (let nonAllow of notAllowed_1.default) {
    if (req.path.match(new RegExp(nonAllow))) {
      res.status(404).sendFile(path_1.default.join(new_dirname, `err/404.html`))
      return
    }
  }
  if (req.path.includes('opendata/data/')) {
    ;(0, opendata_1.opendataRequest)(req, res)
    return
  }
  if (!req.path.includes('.')) {
    const rewritePath = path_1.default.join(new_dirname, `${req.path}.html`)
    if (fs_1.default.existsSync(rewritePath)) {
      res.sendFile(rewritePath)
      return
    }
  }
  if (req.path.endsWith('/')) {
    const rewritePath = path_1.default.join(
      new_dirname,
      `${req.path}index.html`
    )
    if (fs_1.default.existsSync(rewritePath)) {
      res.sendFile(rewritePath)
      return
    }
  }
  res.sendFile(path_1.default.join(new_dirname, req.path))
})
app.use((err, req, res, next) => {
  console.error(err)
  res
    .status(err.statusCode)
    .sendFile(path_1.default.join(new_dirname, `err/${err.statusCode}.html`))
})
app.listen(port, () => console.log(`Listening on ${port}`))
