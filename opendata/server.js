const express = require('express')
const port = process.env.PORT || 3000

const app = express()

app.use((req, res) => {
  res.redirect(301, `https://a01sa01to.com/opendata${req.path}`)
})

app.listen(port, () => console.log(`Listening on ${port}`))
