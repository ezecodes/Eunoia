const express = require('express')

const accountRoute = express.Router()
const {
	updateSocials,
	deleteSocial,
	matchPassword,
	updatePassword,
	getAccount,
	saveProfileInfo,
	getUsers,
	getUserProfile,
	setNotify
} = require('../controllers/account.js')

const { requireAuth } = require('../helpers/auth-helpers')

accountRoute.all('*', requireAuth)

accountRoute.put('/updateSocials', updateSocials)
accountRoute.post('/matchPassword', matchPassword)
accountRoute.put('/updatePassword', updatePassword)
accountRoute.put('/setNotify', setNotify)
accountRoute.put('/saveProfileInfo', saveProfileInfo)

accountRoute.delete('/deleteSocial', deleteSocial)

accountRoute.get('/accountData', getAccount)
accountRoute.get('/users', getUsers)

module.exports = accountRoute