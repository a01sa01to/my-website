'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const str2date = (str) => {
  const date = new Date(str)
  return (
    date.getFullYear() +
    '-' +
    String(date.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(date.getDate()).padStart(2, '0') +
    'T' +
    String(date.getHours()).padStart(2, '0') +
    ':' +
    String(date.getMinutes()).padStart(2, '0') +
    ':' +
    String(date.getSeconds()).padStart(2, '0') +
    '.' +
    (date.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
    '+09:00'
  )
}
exports.default = str2date
