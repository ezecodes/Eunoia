const User = require('../models/User.js')
const { handleError } = require('../helpers/dbErrors')

const { getMaxAge, createToken, requireAuth} = require('../helpers/auth-helpers')
const cookieOpts = {
	SameSite: 'Strict',
	httpOnly: true
}

module.exports.refreshJwt = async (req, res) => {
	const auth = req.headers.authorization
	const userId = auth.split(' ')[1]
	const maxAge = getMaxAge(false)

	const newToken = await createToken(userId, maxAge)
	res.cookie('jwt', newToken, {maxAge, ...cookieOpts})
	res.status(200).send({jwt: newToken})
}

module.exports.register = async (req, res) => {
	const {password, username, email, persistLogin} = req.body
	const maxAge = getMaxAge(persistLogin)

	try {
		const newUser = await User.create({username, password, email, persistLogin})
		const jwt = await createToken(newUser._id, maxAge)
		res.cookie('jwt', jwt, {maxAge, ...cookieOpts})
		res.status(200).send({jwt, username, id: newUser._id})
	}
	catch (err) {
		const errorObj = handleError(err)
		res.status(401).send({error: errorObj})
	}
}

module.exports.login = async (req, res) => {
	const {username, password, persistLogin} = req.body
	const maxAge = getMaxAge(persistLogin)

	try {
		const userId = await User.login(username, password)
		const jwt = await createToken(userId, maxAge)
		res.cookie('jwt', jwt, {maxAge, ...cookieOpts})
		res.status(200).send({jwt, username, id: userId})
	}
	catch (err) {
		res.status(401).send({error: err.message})
	}
}

module.exports.logout = async (req, res) => {
	res.cookie('jwt', '', { expiresIn: 1 })
	res.sendStatus(200)
	res.redirect('/')
}
