require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports.getMaxAge = (persistLogin) => {
	const maxAge = persistLogin ? 365 * 12 * 24 * 60 * 60 : 24 * 60 * 60
	return maxAge
}

module.exports.createToken = async (userId, maxAge) => {
	const token = await jwt.sign({userId}, process.env.JWT_PRIVATE, {
		expiresIn: maxAge
	})
	return token
}

module.exports.requireAuth = async (req, res, next) => {
	const token = req.cookies.jwt

	if (!token) return res.sendStatus(401)

	jwt.verify(token, process.env.JWT_PRIVATE, (err, user) => {
		if (err) return res.sendStatus(401)
		req.userId = user.userId
		next()
	})
}