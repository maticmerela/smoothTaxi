require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 5000

app.get('/test', (req, res) => {
  res.send('Hello World!')
})

app.use(express.static('browser'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})