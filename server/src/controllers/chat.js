const Chat = require('../models/Chat.js')

async function starGroup(request) {
	const {userId, groupId} = request.params
	const {starredObj} = request.body
	await Chat.findOneAndUpdate({_id: userId, 'groups._id': groupId}, {
		'groups.$.isStarred': starredObj
	})
}

async function fetchGroupInfo(request, response) {
	//TODO: validate the token
	const {groupId, userId} = request.params
	
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
	const {userId, sender, chatId} = request.params
	await Chat.findOneAndUpdate({_id: userId, 'chats.username': sender}, {
		$push: {
			'chats.$.unread': chatId
		}
	})
}

async function deleteGroup(request) {
	const {userId, groupId} = request.params
	await Chat.findByIdAndUpdate(userId, {
		$pull: {
			groups: {_id: groupId}
		}
	})
}

async function setGroupUnread(req) {
	const {userId, groupId, chatId} = req.params

	await Chat.findOneAndUpdate({_id: userId, 'groups._id': groupId}, {
		$push: {
			'groups.$.unread': chatId
		}
	})
}

async function clearGroupUnread(req) {
	const {userId, groupId} = req.params

	await Chat.findOneAndUpdate({_id: userId, 'groups._id': groupId}, {
		'groups.$.unread': []
	})
}

async function starConversation(request) {
	const {userId, username} = request.params

	const {starred} = request.body

	await Chat.findOneAndUpdate({_id: userId, 'chats.username': username}, {
		'chats.$.isStarred': starred
	})
}

async function clearConversation(request) {
	const {userId, username} = request.params

	await Chat.findByIdAndUpdate(userId, {
		$pull: {
			chats: {username}
		}
	})
}
async function fetchMessages(request, response) {
	const { friendsName, userId } = request.params

	if (userId !== '' && friendsName !== '') {
		try {
			const chats = await Chat.findOne({_id: userId, 'chats.username': friendsName},
				{username: 1, 'chats.$': 1, starredChat: 1}
			)
			if (chats !== null) {
				response.send({
					username: chats.chats[0].username,
					messages: chats.chats[0].messages || [] ,
					starredChat: chats.chats[0].starredChat || {}
				})
			} else {
				response.send({username: friendsName, messages: [], starredChat: {}})
			}
		} catch(e) {
			e && console.log('Err' + e)
		}
	}
}

function concatArr(arr1 = [], arr2 = []) {
	return [...arr1, ...arr2]
}
async function fetchRecentChats(request, response) {
	const {userId} = request.params
	const chats = 
		await Chat.findOne({_id: userId}, 
			{
				_id: 0,
				'groups.name': 1,
				'groups._id': 1,
				'groups.chatType': 1,
				'groups.messages': 1,
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