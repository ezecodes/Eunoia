const bcrypt = require('bcrypt')
const User = require('../models/User.js')

async function registerUser(request, response) {
	const login = request.body 
	if (!login.password || !login.username || !login.email) {
		response.status(400).send()
	}
	const hashedPassword = await bcrypt.hash(login.password, 10)
	try {
		const foundName = await User.findOne({username: login.username})
		const foundEmail = await User.findOne({email: login.email})
		if (foundName) {
			response.send({nameError: 'This name has been taken'})
		} else if (foundEmail) {
			response.send({emailError: 'Email not valid for this account'})
		} else {
			const inserToDB = await User.create({
				username: login.username,
				email: login.email,
				socials: [{
					name: 'email',
					link: login.email,
				}],
				password: hashedPassword,
				remember: login.remember,
				joined: Date.now(),
			})
			if (inserToDB) {
				response.send({
					id: inserToDB.id,
					username: inserToDB.username,
					socials: inserToDB.socials,
				})
			}
		}
	} catch (e) {
		if (e) {
			console.log('Catch err: ' + e)
			response.status(404).send()
		}
	}
}

async function loginUser(request, response) {
	const login = request.body
	try {
		const user = await User.findOne({ username: login.username })
		if (user) {
			const compare = await bcrypt.compare(login.password, user.password)

			if (compare) 
				response.status(200).send({id: user.id, username: user.username})
			 else 
				response.status(400).send('Something went wrong')
		}
		 else {
			response.status(400).send('Something went wrong')
		}
	} catch (e) {
		response.status(400).send('Something went wrong')
	}
	
}

module.exports = {
	registerUser,
	loginUser
}