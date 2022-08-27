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
		response.json(groupChats)
	}
}

module.exports = {
	fetchGroupChats,
}