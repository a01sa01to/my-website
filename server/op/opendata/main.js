'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const express_graphql_1 = require('express-graphql')
const fs_1 = require('fs')
const graphql_1 = require('graphql')
const path_1 = __importDefault(require('path'))
const cov19_ibaraki_1 = __importDefault(require('./cov19_ibaraki'))
const new_dirname = path_1.default.join(__dirname, '..', '..', '..')
const opendataRequest = (req, res) => {
  if (req.path.includes('/opendata/api/raw/')) {
    res.sendFile(path_1.default.join(new_dirname, req.path))
    return
  }
  const schema = (0, graphql_1.buildSchema)(
    (0, fs_1.readFileSync)(
      path_1.default.join(
        new_dirname,
        'server',
        'graphql',
        'schema',
        'schema.graphql'
      ),
      'utf8'
    ).toString()
  )
  const root = {
    covid19_ibaraki: () => {
      return cov19_ibaraki_1.default.getData()
    },
  }
  res.header('Access-Control-Allow-Origin', '*')
  ;(0, express_graphql_1.graphqlHTTP)({
    schema: schema,
    graphiql: true,
    rootValue: root,
    pretty: true,
  })(req, res)
  return
}
exports.default = opendataRequest
