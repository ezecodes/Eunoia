const express = require('express')
const app = express()
const path = require('path')

const userRoute = require('./src/routes/userRoute.js')
const accountRoute = require('./src/routes/accountRoute.js')
const chatRoute = require('./src/routes/chatRoute.js')

app.use(express.json())

app.disable('x-powered-by')

app.use('/user/', userRoute)
app.use('/account/', accountRoute)
app.use('/chat/', chatRoute)

app.use(express.static('dist'))

app.get('/', (req, res) => { 
	res.sendFile('index.html', {root: path.join(__dirname, '/dist')})
})

module.exports = app