const express = require('express')

const accountRoute = express.Router()
const {
	updateSocials,
	deleteSocial,
	matchPassword,
	updatePassword,
	getAccount,
	getUsers,
	getUserProfile,
	setNotify
} = require('../controllers/account.js')

accountRoute.put('/updateSocials/:id', updateSocials)
accountRoute.put('/matchPassword/:id', matchPassword)
accountRoute.put('/updatePassword/:id', updatePassword)
accountRoute.put('/setNotify/:id', setNotify)

accountRoute.delete('/deleteSocial/:id', deleteSocial)

accountRoute.get('/accountData/:id', getAccount)
accountRoute.get('/users/:id', getUsers)

module.exports = accountRoute