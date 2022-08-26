const User = require('../models/User.js')

async function confirmAccess(req, res, next, userId) {
	console.log(userId)
	// const user = await User.findById(id)
}

module.exports = {confirmAccess}