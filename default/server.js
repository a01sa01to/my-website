const express = require('express')
const fs = require('fs')
const port = process.env.PORT || 3000
const path = require('path')
const { opendataRequest } = require('./opendata/server.js')
const app = express()
const notAllowed = require('./server_notAllowed.json')

app.use((req, res) => {
  console.log(req.path)
  for (let nonAllow of notAllowed) {
    if (req.path.match(new RegExp(nonAllow))) {
      res.status(404).sendFile(path.join(__dirname, `err/404.html`))
      return
    }
  }

  if (req.path.includes('opendata/data/')) {
    opendataRequest(req, res)
    return
  }

  if (!req.path.includes('.')) {
    const rewritePath = path.join(__dirname, `${req.path}.html`)
    if (fs.existsSync(rewritePath)) {
      res.sendFile(rewritePath)
      return
    }
  }
  if (req.path.endsWith('/')) {
    const rewritePath = path.join(__dirname, `${req.path}index.html`)
    if (fs.existsSync(rewritePath)) {
      res.sendFile(rewritePath)
      return
    }
  }
  res.sendFile(path.join(__dirname, req.path))
})

app.use((err, req, res, next) => {
  console.error(err)
  res
    .status(err.statusCode)
    .sendFile(path.join(__dirname, `err/${err.statusCode}.html`))
})

app.listen(port, () => console.log(`Listening on ${port}`))
