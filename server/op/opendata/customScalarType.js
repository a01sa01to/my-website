'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.DateTimeType = void 0
const graphql_1 = require('graphql')
const language_1 = require('graphql/language')
const DateTimeType = new graphql_1.GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  parseValue: (value) => {
    if (typeof value === 'string') return new Date(value)
    else throw new Error('DateTime cannot represent value: ' + value)
  },
  serialize: (value) => {
    if (value instanceof Date) return value.toISOString()
    else throw new Error('DateTime cannot represent value: ' + value)
  },
  parseLiteral: (ast) => {
    if (ast.kind === language_1.Kind.STRING) return new Date(ast.value)
    else throw new Error('DateTime cannot represent value: ' + ast)
  },
})
exports.DateTimeType = DateTimeType
