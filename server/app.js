const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser')

const authRoute = require('./src/routes/authRoute')
const accountRoute = require('./src/routes/accountRoute')
const chatRoute = require('./src/routes/chatRoute')

app.use(express.json())
app.use(cookieParser())

app.disable('x-powered-by')

app.use('/auth/', authRoute)
app.use('/account/', accountRoute)
app.use('/chat/', chatRoute)

app.use(express.static('dist'))

app.get('/', (req, res) => { 
	res.sendFile('index.html', {root: path.join(__dirname, 'dist')})
})

module.exports = app