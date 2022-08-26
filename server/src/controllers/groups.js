const PrivateGroup = require('../models/PrivateGroup.js')

async function fetchGroupChats(request, response) {
	const {groupId} = request.params

	const groupChats = await PrivateGroup.findOne({_id: groupId}, {
		_id: 1,
		name: 1,
		messages: {$slice: -10}, 
		createdBy: 1,
		participants: 1,
		admins: 1,
		description: 1,
		settings: 1,
	})

	if (groupChats) {
		response.send(groupChats)
	}
}


async function fetchUpdatedGroupField(request, response) {
	console.log(request.params, request.body)
	return
	// const {groupId} = request.params
	// const {field} = request.body
	// const field = JSON.parse(specific)
	// const groupChats = await PrivateGroup.findOne({_id: groupId}, {
	// 	_id: 0,
	// 	...field
	// })

	// if (!groupChats) return false
	// response.send({groupChats, groupId})
}


module.exports = {
	fetchGroupChats,
	fetchUpdatedGroupField
}