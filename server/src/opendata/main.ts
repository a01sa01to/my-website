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

  graphqlHTTP({
    schema: schema,
    graphiql: true,
    rootValue: root,
    pretty: true,
  })(req, res)
  return
}

export default opendataRequest
