const fs = require('fs')
const path = require('path')

exports.opendataRequest = (req, res) => {
  const c400 = () => {
    res.status(400).sendFile(path.join(__dirname, '..', `err/400.html`))
    return
  }
  try {
    res.header('Access-Control-Allow-Origin', '*')
    if (
      (req.query.mode === 'json' && req.path.endsWith('.csv')) ||
      req.path.endsWith('.json')
    ) {
      // JSONに変換
      const filecontent = fs
        .readFileSync(path.join(__dirname, '..', req.path))
        .toString()

      let fileToJson

      if (req.path.endsWith('.csv')) {
        const rows = filecontent.replace(/\r/g, '').split('\n')
        const key = rows[0].split(',')
        rows.splice(0, 1)
        fileToJson = rows
          .filter((row) => row.split(',').length === key.length)
          .map((row) => {
            const _ = row.split(',')
            const __ = {}
            for (let i = 0; i < key.length; i++) {
              if (_[i] && Number(_[i]) !== 0 && String(_[i])[0] === '0') {
                // Do nothing
              } else if (!isNaN(Number(_[i]))) {
                _[i] = Number(_[i])
              }
              __[key[i]] = _[i]
            }
            return __
          })
      } else {
        fileToJson = JSON.parse(filecontent)
      }

      // Queryを成形
      if (req.query.filter) {
        let filt = decodeURIComponent(req.query.filter).split(';')
        filt = filt.map((f) => {
          const __ = f.split('__')
          return {
            type: __[0],
            key: __[1],
            mode: __[2],
            val: __.slice(3).join('__'),
          }
        })
        filt.forEach((_) => {
          switch (_.type) {
            case 'key':
              // array形式
              _.key = JSON.parse(_.key)
              const tmp = []
              for (let i = 0; i < fileToJson.length; i++) {
                const tmp_obj = {}
                _.key.forEach((key) => {
                  tmp_obj[key] = fileToJson[i][key]
                })
                tmp.push(tmp_obj)
              }
              fileToJson = tmp
              break
            case 'date':
              if (_.mode === 'from') {
                fileToJson = fileToJson.filter(
                  (__) => new Date(__[_.key]) >= new Date(_.val)
                )
              } else if (_.mode === 'to') {
                fileToJson = fileToJson.filter(
                  (__) => new Date(__[_.key]) <= new Date(_.val)
                )
              } else {
                c400()
                return
              }
              break
            case 'num':
              if (_.mode === 'over') {
                fileToJson = fileToJson.filter(
                  (__) => Number(__[_.key]) >= Number(_.val)
                )
              } else if (_.mode === 'under') {
                fileToJson = fileToJson.filter(
                  (__) => Number(__[_.key]) <= Number(_.val)
                )
              } else {
                c400()
                return
              }
              break
            case 'str':
              if (_.mode === 'eq') {
                fileToJson = fileToJson.filter((__) => __[_.key] === _.val)
              } else if (_.mode === 'ne') {
                fileToJson = fileToJson.filter((__) => __[_.key] !== _.val)
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

    res.sendFile(path.join(__dirname, '..', req.path))
  } catch (e) {
    console.error(e)
    c400()
  }
  return
}
