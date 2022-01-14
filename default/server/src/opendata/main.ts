import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { readFileSync } from 'fs'
import { buildSchema } from 'graphql'
import path from 'path'

import Covid19_ibaraki from './cov19_ibaraki'

const new_dirname = path.join(__dirname, '..', '..', '..')

const opendataRequest = (req: express.Request, res: express.Response) => {
  if (req.path.includes('/opendata/api/raw/')) {
    res.sendFile(path.join(new_dirname, req.path))
    return
  }

  const schema = buildSchema(
    readFileSync(
      path.join(new_dirname, 'server', 'graphql', 'schema', 'schema.graphql'),
      'utf8'
    ).toString()
  )

  const root = {
    covid19_ibaraki: () => {
      return Covid19_ibaraki.getData()
    },
  }

  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization'
  )
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
    return
  }

  graphqlHTTP({
    schema: schema,
    graphiql: false,
    rootValue: root,
    pretty: true,
  })(req, res)
  return
}

export default opendataRequest
