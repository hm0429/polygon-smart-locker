const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.static('public'))
app.set('view engine', 'pug')
app.use(express.json())

app.get('/', (req, res) => {
	res.render('index')
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log('Listening on port', port)
})