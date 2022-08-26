const express = require('express')

const userRoute = express.Router()

const {
	registerUser,
	loginUser
} = require('../controllers/user.js')

userRoute.post('/register', registerUser)
userRoute.post('/login', loginUser)

module.exports = userRoute