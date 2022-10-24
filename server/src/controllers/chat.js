const Chat = require('../models/Chat.js')

async function starGroup(request) {
	const { userId } = request
	const { groupId } = request.params
	await Chat.findOneAndUpdate({_id: userId, 'groups._id': groupId}, {
		'groups.$.isStarred': request.body
	})
}

async function fetchGroupInfo(request, response) {
	const { userId } = request
	const {groupId} = request.params
	
	const group = await Chat.findOne({_id: userId, 'groups._id': groupId}, {
		'groups.$': 1
	})
	if (group !== null && group.groups[0]) {
		response.send(group.groups[0])
	} else {
		response.end()
	}
}

async function saveUnreadChat(request) {
	const { userId } = request
	const { sender, chatId} = request.body
	await Chat.findOneAndUpdate({_id: userId, 'chats.username': sender}, {
		$push: {
			'chats.$.unread': chatId
		}
	})
}

async function deleteGroup(request) {
	const { userId } = request
	const {groupId} = request.body
	await Chat.findByIdAndUpdate(userId, {
		$pull: {
			groups: {_id: groupId}
		}
	})
}

async function setGroupUnread(req) {
	const { userId } = req
	const {groupId, chatId} = req.body

	await Chat.findOneAndUpdate({_id: userId, 'groups._id': groupId}, {
		$push: {
			'groups.$.unread': chatId
		}
	})
}

async function clearGroupUnread(req) {
	const {userId} = req
	const { groupId } = req.body

	await Chat.findOneAndUpdate({_id: userId, 'groups._id': groupId}, {
		'groups.$.unread': []
	})
}

async function starConversation(request) {
	const {userId} = request
	const { username } = request.body

	const {starred} = request.body

	await Chat.findOneAndUpdate({_id: userId, 'chats.username': username}, {
		'chats.$.isStarred': starred
	})
}

async function clearConversation(request) {
	const { userId } = request
	const {username} = request.body

	await Chat.findByIdAndUpdate(userId, {
		$pull: {
			chats: {username}
		}
	})
}
async function fetchMessages(request, response) {
	const { userId } = request
	const { username } = request.params
	// console.log(userId, username)
	if (!userId || !username) response.status(404).send()
	try {
		const chats = await Chat.findOne({_id: userId, 'chats.username': username},
			{
				'chats.$': 1
			}
		)
		
		if (chats !== null) {
			response.status(200).send({
				username: chats.chats[0].username,
				messages: chats.chats[0].messages
			})
		} else {
			response.status(200).send({
				username, messages: []
			})
		}
	} catch(e) {
		e && console.log('Err' + e)
	}
}

function concatArr(arr1 = [], arr2 = []) {
	return [...arr1, ...arr2]
}
async function fetchRecentChats(request, response) {
	const { userId} = request
	const chats = 
		await Chat.findOne({_id: userId}, 
			{
				_id: 0,
				'groups.name': 1,
				'groups._id': 1,
				'groups.chatType': 1,
				'groups.lastSent': 1,
				'groups.lastChat': 1,
				'groups.isStarred': 1,
				'groups.unread': 1,
				'groups.isNull': 1,
				
				'chats.username': 1, 
				'chats.chatType': 1, 
				'chats.displayName': 1,
				'chats.lastSent': 1, 
				'chats.unread': 1,
				'chats.isStarred': 1,
				'chats.messages': {$slice: -1}, 
	}) || []

	const recentChats = concatArr(chats.chats, chats.groups)
	response.send({recentChats})
}
module.exports = {
	fetchMessages,
	starConversation,
	clearConversation,
	fetchGroupInfo,
	setGroupUnread,
	clearGroupUnread,
	starGroup,
	saveUnreadChat,
	deleteGroup,
	fetchRecentChats,
}