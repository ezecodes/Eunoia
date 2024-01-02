const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser')

const authRoute = require('./src/routes/authRoute')
const accountRoute = require('./src/routes/accountRoute')
const chatRoute = require('./src/routes/chatRoute')
const CLIENT_ORIGINS = process.env.CLIENT_ORIGINS.split(', ')
const cors = require('cors')
var morganLog = require('morgan');

app.use(morganLog('dev'));
app.disable('x-powered-by')
app.use(express.json())
app.use(cookieParser())

app.use(cors({
    methods: 'GET, POST, DELETE',
    origin: CLIENT_ORIGINS,
    credentials: true
}));

app.use('/auth/', authRoute)
app.use('/account/', accountRoute)
app.use('/chat/', chatRoute)

module.exports = app