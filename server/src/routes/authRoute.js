const express = require('express')

const authRoute = express.Router()

const {
	register,
	login,
	refreshJwt,
	logout
} = require('../controllers/auth')

authRoute.get('/refresh', refreshJwt)
authRoute.post('/register', register)
authRoute.post('/login', login)
authRoute.delete('/logout', logout)

module.exports = authRoute