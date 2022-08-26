const express = require('express')
const app = express()

const userRoute = require('./src/routes/userRoute.js')
const accountRoute = require('./src/routes/accountRoute.js')
const chatRoute = require('./src/routes/chatRoute.js')

app.use(express.json())

app.use('/user/', userRoute)
app.use('/account/', accountRoute)
app.use('/chat/', chatRoute)

app.get('/', (req, res) => { 
	res.sendFile('index.html', {root:  path.join(__dirname, '/dist')})
})

module.exports = app