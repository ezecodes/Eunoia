const bcrypt = require('bcrypt')
const User = require('../models/User.js')

async function getUsers(request, response) {
	const { id } = request.params
 	const users = await User.find({_id: {$ne: id}}, {
 		username: 1, displayName: 1, lastSeen: 1, bio: 1, joined: 1, pId: 1, _id: 0
 	})

 	response.send({users: users})
}

async function getUserProfile(request, response) {
	const {id, username} = request.params
	
	const friend = await User.findOne({username}, {_id: 0, bio: 1, socials: 1})

	response.send({profile: {
		username,
		bio: friend.bio || '',
		socials: friend.socials.filter(i => !i.hidden)
	}})
}

async function matchPassword(request, response) {
	const id = request.params.id
 	const user = await User.findById(id)
 	if (user) {
 		try {
 			const compare = await bcrypt.compare(request.body.value, user.password)
 			if (compare) {
 				response.send({type: 'success'})
 			} else {
 				response.send({type: 'error'})
 			}
 		} catch (e) {
 			e && console.log(e)
 		}
 	}
}

async function updatePassword(request, response) {
	const hashedPassword = await bcrypt.hash(request.body.value, 10)
	const user = await User.findByIdAndUpdate(request.params.id, {password: hashedPassword})
	if (user) response.send({type: 'success'})
}

async function deleteSocial(request, response) {
	const {id} = request.params
	const social = request.body

	await User.findByIdAndUpdate(id, 
		{
			$pull: {socials: {name: social.name}}
		}
	)
}

async function updateSocials(request, response) {
	const social = request.body
	const {id} = request.params

	const saved = await User.findOne({_id: id}, {_id:0, socials: 1})
	const index = saved.socials.findIndex(i => i.name === social.name)
	// const saved
	let update

	if (index === -1) {
		 update = await User.findOneAndUpdate(
			{_id: id},
			{$push: {'socials': social}}, 
		)
	} else {
		update = await User.findOneAndUpdate(
			{_id: id},
			{'$set': {'socials.$[social]': social}}, 
			{arrayFilters: [{'social.name': social.name}]},
		)
	}
	// response.send(update.socials)
}

async function getAccount(request, response) {
	const {id} = request.params
	const user = await User.findById(id, {
		_id: 0,
		pId: 1,
		socials: 1,
		bio: 1,
		displayName: 1,
		updateNameTimestamp: 1,
		createdGroups: 1
	})
	response.send(user)
}

module.exports = {
	getUsers,
	getUserProfile,
	matchPassword,
	updatePassword,
	deleteSocial,
	updateSocials,
	getAccount
}