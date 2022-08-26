const io = require('socket.io')()
const groupSession = require('./src/sockets/sessions/groupSession.js')

const user = io.of('/user')

const {
	chatsUtil,
	unreadUtil,
	userUtil,
	groupsUtil
} = require('./src/useCase/script.js')

let connectedClients = [], onlineUsers = []

user.use((socket, next) => {
	const {token, username} = socket.handshake.auth
	userUtil.confirmUser(token, () => {
		socket.username = username
		next()
	})

})

async function emitToGroup({_id, evt, body}, except = '') {
	const find = groupSession.getUsers(_id)
	if (find !== undefined && find !== null && find.length > 0) {
		find.forEach(({username}) => {
			if (username === except) return
			emit(username, evt, body)
		})
	} else {
		const participants = await groupsUtil.fetchParticipants(_id)
		groupSession.appendGroup({_id, participants})
		emitToGroup({_id, evt, body}, except)
	}
}

function emit(_name, evt, body) {
	const res = onlineUsers.find(i => i.username === _name)
	if (!res) return

	user.to(res.socketId).emit(evt, body)
}

user.on('connection', socket => {
	for (let [id, socket] of user.sockets) {
		onlineUsers = onlineUsers.filter(i => i.username !== socket.username)
		onlineUsers.push({
			socketId: id,
			username: socket.username
		})
		user.emit('onlineUsers', onlineUsers)
	}
	
	socket.on('disconnect', () => {
		onlineUsers = onlineUsers.filter(i => i.username !== socket.username)
		user.emit('userDisconnect', {username: socket.username})
	})

	socket.on('getOnileUsers', () => {
		socket.emit('onlineUsers', onlineUsers)
	})

	socket.on('sentChat', obj => {
		let {receiver, sender, lastSent, message } = obj
		chatsUtil.save({user1: sender, user2: receiver, lastSent, message})
		chatsUtil.save({user1: receiver, user2: sender, lastSent, message})

		emit(receiver, 'chatFromUser', {sender, message})
	})

	socket.on('chatIsRead', obj => {
		let {sender, receiver} = obj
		unreadUtil.reset({sender, receiver})
		emit(sender, 'chatHasBeenRead', {sender, receiver})
	})

	socket.on('deleteChatForAll', obj => {
		chatsUtil.deleteForAll(obj)
		emit(obj.friendsName, 'deleteChat', {
			friendsName: obj.deletedBy,
			chatId: obj.chatId
		})
	})

	socket.on('deleteForOne', obj => {
		chatsUtil.deleteForOne(obj)
		emit(obj.friendsName, 'deleteChat', {
			friendsName: obj.deletedBy,
			chatId: obj.chatId
		})
	})

	socket.on('userIsTyping', obj => {
		const {typing, selectedUser, user} = obj
		emit(obj.selectedUser, 'userIsTyping', {typing, user})
	})

	socket.on('newGroup', async obj => {
		// save to DB and get group ID
		const _id = await groupsUtil.createGroup(obj)

		// append it to group session
		groupSession.appendGroup({_id, participants: obj.participants})

		// emit to all participants
		emitToGroup({
			_id, 
			evt: 'fetchGroupInfo', 
			body: {_id}
		})
	})

	socket.on('chatFromGroup', chatObj => {
		const {_id, chat} = chatObj
		groupsUtil.saveChat({_id, chat})

		emitToGroup({
			_id, 
			evt: 'chatFromGroup', 
			body: {_id, chat}
		})
	})

	socket.on('deleteGroupChat', ({_id, chatId}) => {
		groupsUtil.deleteForAll({_id, chatId})
		emitToGroup({
			_id, 
			evt: 'deleteGroupChat', 
			body: {_id, chatId}
		})
	})

	socket.on('groupTyping', ({_id, typing, username}) => {
		emitToGroup({
			_id, 
			evt: 'groupTyping', 
			body: {_id, username, typing}
		}, username)
	})

	socket.on('removeGroupUser', ({_id, username, message}) => {
		groupsUtil.removeGroupUser({_id, username, message}, participants => {
			groupSession.appendGroup({_id, participants})
			emitToGroup({
				_id,
				evt: 'fetchGroupInfo',
				body: {_id}
			})
			emitToGroup({
				_id,
				evt: 'getUpdatedGroupField',
				body: {
					field: {participants: 1}
				}
			})
		})
	})

	socket.on('addGroupMembers', async ({_id, members, message}) => {

		await groupsUtil.addGroupMembers({_id, members, message}, participants => {
			groupSession.appendGroup({_id, participants})
			emitToGroup({
				_id,
				evt: 'fetchGroupInfo',
				body: {_id}
			})
			emitToGroup({
				_id,
				evt: 'getUpdatedGroupField',
				body: {
					field: {participants: 1}
				}
			})
		})
	})

})

module.exports = io

// 	const addMembers = (groupId, members) => {
// 		const find = groups.findIndex(i => i.group.groupId === groupId)
// 		if (find === -1) return false

// 		members.forEach(user => {
// 			const idx = groups[find].participants.findIndex(i => i.username === user.username)

// 			if (idx === -1) {
// 				groups[find].participants.push(user)
// 			}
// 		})
// 	}

// 	const removeParticipant = (groupId, username) => {
// 		const find = groups.findIndex(i => i.group.groupId === groupId)
// 		if (find === -1) return false

// 		const idx = groups[find].participants.findIndex(i => i.username === username)
// 		if (idx === -1) return false
// 		groups[find].participants.splice(idx, 1)
// 	}

// 	socket.on('newGroup', (id, groupDetails) => {
// 		// TODOS: send to all participants from loopParticipants function
// 		const {participants, group, messages} = groupDetails

// 		confirmUser.id(id, () => {
// 			participants.forEach(user => {
// 				search(onlineUsers, 'username', user.username, ({result}) => {
// 				})
// 			})
// 		})
// 		groupsUtil.createGroup(groupDetails)

// 	})

// 		addMembers(group.groupId, members)

// 		members.forEach(user => {
// 			search(onlineUsers, 'username', user.username, ({result}) => {
// 				io.to(result.socketId).emit('addedGroup', group.groupId)
// 			})
// 		})

// 		loopParticipants(group.groupId, (_user) => {
// 			search(onlineUsers, 'username', _user.username, ({result}) => {
// 				io.to(result.socketId).emit('groupAction', group.groupId, {participants: 1})
// 			})
// 		})
// 	})

// 	socket.on('removeGroupUser', (id, {groupId, username, message}) => {
// 		confirmUser.id(id, () => {

// 			removeParticipant(groupId, username)

// 			search(onlineUsers, 'username', username, ({result}) => {
// 				io.to(result.socketId).emit('leaveGroup', groupId)
// 				io.to(result.socketId).emit('groupAction', groupId, {participants: 1, admins: 1})
// 			})

// 			loopParticipants(groupId, (_user) => {
// 				groupsUtil.saveLastChat({groupId, username: _user.username, chat: message})
// 				search(onlineUsers, 'username', _user.username, ({result}) => {
// 					io.to(result.socketId).emit('groupAction', groupId, {participants: 1})
// 				})
// 			})

// 		})
// 	})

// 	//TODO: assert that the user editing is an admin
// 	// when allowEditForAdminsOnly set to true
// 	socket.on('editGroupName', (id, creator, {groupId, groupName, message}) => {
// 		confirmUser.id(id, () => {
// 			groupsUtil.saveName(creator, {groupName, groupId, message})
// 			loopParticipants(groupId, (user) => {
// 				search(onlineUsers, 'username', user.username, ({result}) => {
// 					io.to(result.socketId).emit('groupAction', groupId, {group: 1})
// 					io.to(result.socketId).emit('updateGroupInRecent', groupId, {group: 1})
// 				})
// 			})
// 		})
// 	})

// 	socket.on('editGroupDescription', (id, {groupId, description, message}) => {
// 		confirmUser.id(id, () => {
// 			loopParticipants(groupId, (user) => {
// 				groupsUtil.saveLastChat({groupId, username: user.username, chat: message})
// 				search(onlineUsers, 'username', user.username, ({result}) => {
// 					io.to(result.socketId).emit('groupAction', groupId, {description: 1})
// 					// io.to(result.socketId).emit('saveGroupDescription', groupId)
// 				})
// 			})
// 			groupsUtil.saveDescription({description, groupId, message})
// 		})
// 	})

// 	socket.on('handleGroupSettings', (id, groupId, settings) => {
// 		confirmUser.id(id, () => {
// 			loopParticipants(groupId, (_user) => {
// 				search(onlineUsers, 'username', _user.username, ({result, index}) => {
// 					io.to(result.socketId).except(socket.id).emit('groupAction', groupId, {settings: 1})
// 				})
// 			})
// 			groupsUtil.saveSettings({groupId, settings})
// 		})
// 	})

// 	})

// 	socket.on('addAdmin', (id, {groupId, username}) => {
// 		confirmUser.id(id, () => {
// 			loopParticipants(groupId, (_user) => {
// 				search(onlineUsers, 'username', _user.username, ({result, index}) => {
// 					io.to(result.socketId).emit('groupAction', groupId, {admins: 1})
// 				})
// 			})
// 			groupsUtil.addAdmin({groupId, username})
// 		})
// 	})
	
// 	socket.on('deleteGroupChat', (id, username, groupId, chat) => {
// 		confirmUser.id(id, (_username) => {
// 			if (username !== chat.sender) return false

// 			loopParticipants(groupId, (_user) => {
// 				search(onlineUsers, 'username', _user.username, ({result, index}) => {
// 					io.to(result.socketId).except(socket.id).emit('deleteGroupChat', {groupId, chat})
// 				})
// 			})
// 			groupsUtil.deleteOne(id, groupId, chat.chatId)
// 			groupsUtil.deleteForAll({groupId, chat})
// 		})
// 	})

// 	socket.on('saveGroupUnread', ({id, groupId, chatId = '', rule}) => {
// 		confirmUser.id(id, () => {
// 			rule === 'save' ?
// 			 groupsUtil.saveUnread({id, groupId, chatId})
// 			: groupsUtil.clearUnread({id, groupId})
// 		})
// 	})


// })
