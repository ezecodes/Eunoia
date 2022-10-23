const bcrypt = require('bcrypt')
const User = require('../models/User.js')

async function setNotify(req, res) {
	const {userId} = req
	const {update} = req.body

	const {notifications} = await User.findByIdAndUpdate(userId, {
		notifications: update
	}, {new: true})

	res.send({notifications})
}

async function saveProfileInfo(req, res) {
	const {userId} = req

	const {displayName: _displayName, bio: _bio} = req.body

	const {displayName, bio} = await User.findByIdAndUpdate(userId, {
		displayName: _displayName,
		bio: _bio
	}, {new: true, upsert: true})

	res.status(200).send({displayName, bio})
}

async function getUsers(request, response) {
	const { userId } = request
 	const users = await User.find({_id: {$ne: userId}}, {
 		username: 1, 
 		displayName: 1, 
 		lastSeen: 1, 
 		bio: 1, 
 		joined: 1, 
 		pId: 1, 
		socials: 1,
 		_id: 0
 	})

 	users.map(i => {
 		if (!i.socials) return

 		i.socials = i.socials.filter(social => social.hidden === false)

 	})

 	response.send({users})
}
async function matchPassword(request, response) {
	const {userId} = request
 	const user = await User.findById(userId)
 	const {former} = request.body
 	if (user) {
 		try {
 			const compare = await bcrypt.compare(former, user.password)
 			if (compare) {
 				response.sendStatus(200)
 			} else {
 				response.send({error: {former: 'Passwords do not match'}})
 			}
 		} catch (e) {
 			e && console.log(e)
 		}
 	}
}

async function updatePassword(request, response) {
	const { userId} = request
	const { newPassword, confirmPassword, former } = request.body
	const hashedPassword = await bcrypt.hash(newPassword, 10)
	const user = await User.findByIdAndUpdate(userId, {password: hashedPassword})
	if (user) response.sendStatus(200)
}

async function deleteSocial(request, response) {
	const {userId} = request
	const social = request.body

	await User.findByIdAndUpdate(userId, 
		{
			$pull: {socials: {name: social.name}}
		}
	)
}

async function updateSocials(request, response) {
	const social = request.body
	const {userId} = request

	const saved = await User.findOne({_id: userId}, {_id:0, socials: 1})
	const index = saved.socials.findIndex(i => i.name === social.name)
	// const saved
	let update

	if (index === -1) {
		 update = await User.findOneAndUpdate(
			{_id: userId},
			{$push: {'socials': social}}, 
		)
	} else {
		update = await User.findOneAndUpdate(
			{_id: userId},
			{'$set': {'socials.$[social]': social}}, 
			{arrayFilters: [{'social.name': social.name}]},
		)
	}
	// response.send(update.socials)
}

async function getAccount(request, response) {
	const {userId} = request
	const user = await User.findById(userId, {
		_id: 0,
		pId: 1,
		socials: 1,
		bio: 1,
		displayName: 1,
		notifications: 1,
		updateNameTimestamp: 1,
		createdGroups: 1
	})
	if (user) response.send(user)
		else {
			response.status(404).send()
		}
}

module.exports = {
	getUsers,
	matchPassword,
	updatePassword,
	deleteSocial,
	setNotify,
	saveProfileInfo,
	updateSocials,
	getAccount
}