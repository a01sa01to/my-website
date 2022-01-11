import express from 'express'
import fs from 'fs'
import path from 'path'

import notAllowed from './notAllowed'
import { opendataRequest } from './opendata'

const port = process.env.PORT || 3000
const app = express()
const new_dirname = path.join(__dirname, '..', '..')

app.set('json spaces', 2)

app.use((req: express.Request, res: express.Response) => {
  if (req.hostname.startsWith('www')) {
    res.redirect(301, `https://a01sa01to.com${req.path}`)
    return
  }

  console.log(req.path)

  for (let nonAllow of notAllowed) {
    if (req.path.match(new RegExp(nonAllow))) {
      res.status(404).sendFile(path.join(new_dirname, `err/404.html`))
      return
    }
  }

  if (req.path.includes('opendata/data/')) {
    opendataRequest(req, res)
    return
  }

  if (!req.path.includes('.')) {
    const rewritePath = path.join(new_dirname, `${req.path}.html`)
    if (fs.existsSync(rewritePath)) {
      res.sendFile(rewritePath)
      return
    }
  }
  if (req.path.endsWith('/')) {
    const rewritePath = path.join(new_dirname, `${req.path}index.html`)
    if (fs.existsSync(rewritePath)) {
      res.sendFile(rewritePath)
      return
    }
  }
  res.sendFile(path.join(new_dirname, req.path))
})

interface HTTPError {
  statusCode: number
}

app.use(
  (
    err: HTTPError,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err)
    res
      .status(err.statusCode)
      .sendFile(path.join(new_dirname, `err/${err.statusCode}.html`))
  }
)

app.listen(port, () => console.log(`Listening on ${port}`))
