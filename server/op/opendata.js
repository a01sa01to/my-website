'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.opendataRequest = void 0
const fs_1 = __importDefault(require('fs'))
const path_1 = __importDefault(require('path'))
const new_dirname = path_1.default.join(__dirname, '..', '..')
const opendataRequest = (req, res) => {
  const c400 = () => {
    res
      .status(400)
      .sendFile(path_1.default.join(new_dirname, 'err', '400.html'))
    return
  }
  try {
    res.header('Access-Control-Allow-Origin', '*')
    if (
      (req.query.mode === 'json' && req.path.endsWith('.csv')) ||
      req.path.endsWith('.json')
    ) {
      // JSONに変換
      const filecontent = fs_1.default
        .readFileSync(path_1.default.join(new_dirname, req.path))
        .toString()
      let fileToJson
      if (req.path.endsWith('.csv')) {
        const rows = filecontent.replace(/\r/g, '').split('\n')
        const key = rows[0].split(',')
        rows.splice(0, 1)
        fileToJson = rows
          .filter((row) => row.split(',').length === key.length)
          .map((row) => {
            const eachvalue = row.split(',')
            const ret = {}
            for (let i = 0; i < key.length; i++) {
              if (
                eachvalue[i] &&
                Number(eachvalue[i]) !== 0 &&
                String(eachvalue[i])[0] === '0'
              ) {
                // Do nothing
              } else if (!isNaN(Number(eachvalue[i]))) {
                ret[key[i]] = Number(eachvalue[i])
              } else {
                ret[key[i]] = eachvalue[i]
              }
            }
            return ret
          })
      } else {
        fileToJson = JSON.parse(filecontent)
      }
      // Queryを成形
      if (req.query.filter) {
        let filtraw = decodeURIComponent(String(req.query.filter)).split(';')
        let filt = filtraw.map((f) => {
          const __ = f.split('__')
          return {
            type: __[0],
            key: __[1],
            mode: __[2],
            val: __.slice(3).join('__'),
          }
        })
        filt.forEach((f) => {
          switch (f.type) {
            case 'key':
              // array形式
              const keys = JSON.parse(f.key)
              const tmp = []
              for (let i = 0; i < fileToJson.length; i++) {
                const tmp_obj = {}
                keys.forEach((key) => {
                  tmp_obj[key] = fileToJson[i][key]
                })
                tmp.push(tmp_obj)
              }
              fileToJson = tmp
              break
            case 'date':
              if (f.mode === 'from') {
                fileToJson = fileToJson.filter(
                  (data) => new Date(data[f.key]) >= new Date(f.val)
                )
              } else if (f.mode === 'to') {
                fileToJson = fileToJson.filter(
                  (data) => new Date(data[f.key]) <= new Date(f.val)
                )
              } else {
                c400()
                return
              }
              break
            case 'num':
              if (f.mode === 'over') {
                fileToJson = fileToJson.filter(
                  (data) => Number(data[f.key]) >= Number(f.val)
                )
              } else if (f.mode === 'under') {
                fileToJson = fileToJson.filter(
                  (data) => Number(data[f.key]) <= Number(f.val)
                )
              } else {
                c400()
                return
              }
              break
            case 'str':
              if (f.mode === 'eq') {
                fileToJson = fileToJson.filter((data) => data[f.key] === f.val)
              } else if (f.mode === 'ne') {
                fileToJson = fileToJson.filter((data) => data[f.key] !== f.val)
              } else {
                c400()
                return
              }
              break
            default:
              c400()
              return
          }
        })
      }
      res.json(fileToJson)
      return
    }
    if (fs_1.default.existsSync(path_1.default.join(new_dirname, req.path)))
      res.sendFile(path_1.default.join(new_dirname, req.path))
    else
      res
        .status(404)
        .sendFile(path_1.default.join(new_dirname, 'err', '404.html'))
  } catch (e) {
    console.error(e)
    c400()
  }
  return
}
exports.opendataRequest = opendataRequest
