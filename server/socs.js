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

async function emitToGroup({_id, evt, body}, except = '') {
	const find = groupSession.getUsers(_id)
	if (find !== undefined && find !== null && find.length > 0) {
		find.forEach(({username}) => {
			if (username === except) return
			emit({name: username, evt, body})
		})
	} else {
		const participants = await groupsUtil.fetchParticipants(_id)
		groupSession.appendGroup({_id, participants})
		emitToGroup({_id, evt, body}, except)
	}
}

function emit({name, evt, body}, handleOfflineSession = () => {}) {
	const res = onlineUsers.find(i => i.username === name)
	if (!res) {
		handleOfflineSession()
		return
	}

	user.to(res.socketId).emit(evt, body)
}

user.use((socket, next) => {
	const {token, username} = socket.handshake.auth
	userUtil.confirmUser(token, () => {
		socket.username = username
		next()
	})

})
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
		userUtil.setLastSeen(socket.username)
	})

	socket.on('getOnileUsers', () => {
		socket.emit('onlineUsers', onlineUsers)
	})

	socket.on('sentChat', obj => {
		let {receiver, sender, lastSent, message } = obj
		chatsUtil.save({user1: sender, user2: receiver, lastSent, message})
		chatsUtil.save({user1: receiver, user2: sender, lastSent, message})

		emit({name: receiver, evt: 'chatFromUser', body: {sender, message}}, () => {
			chatsUtil.saveUnread({
				receiver,
				sender,
				chatId: message.chatId
			})
		})
	})

	socket.on('chatIsRead', obj => {
		let {sender, receiver} = obj
		unreadUtil.reset({sender, receiver})
		emit({name: sender, evt: 'chatHasBeenRead', body: {sender, receiver}})
	})

	socket.on('deleteChatForAll', obj => {
		chatsUtil.deleteForAll(obj)
		emit({
			name: obj.friendsName, 
			evt: 'deleteChat', 
			body: {
				friendsName: obj.deletedBy,
				chatId: obj.chatId
			}
		})
	})

	socket.on('deleteForOne', obj => {
		chatsUtil.deleteForOne(obj)
		emit({
			name: obj.friendsName, 
			evt: 'deleteChat', 
			body: {
				friendsName: obj.deletedBy,
				chatId: obj.chatId
			}
		})
	})

	socket.on('userIsTyping', obj => {
		const {typing, selectedUser, user} = obj
		emit({
			name: obj.selectedUser, 
			evt: 'userIsTyping', 
			body: {typing, user}
		})
	})

	socket.on('newGroup', obj => {
		// save to DB and get group ID
		groupsUtil.createGroup(obj, _id => {
			// append it to group session
			groupSession.appendGroup({_id, participants: obj.participants})

			// emit to all participants
			emitToGroup({
				_id, 
				evt: 'fetchGroupInfo', 
				body: {_id}
			})
		})
		
	})

	socket.on('chatFromGroup', ({_id, chat}) => {
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
		emitToGroup({_id, evt: 'chatFromGroup', body: {_id, chat: message}})

		groupsUtil.removeGroupUser({_id, username, message}, (participants, admins) => {

			// participants also gets the updated group fields - (participants, admins)
			emitToGroup({
				_id,
				evt: 'removeGroupUser',
				body: {
					participants, 
					admins,
					_id
				}
			})
			groupSession.appendGroup({_id, participants})

			// the removed user fetches the updated group info
			emit({name: username, evt: 'fetchGroupInfo', body: {_id}})
			
		})
	})

	socket.on('addGroupMembers', async ({_id, members, message}) => {

		await groupsUtil.addGroupMembers({_id, members, message}, participants => {
			groupSession.appendGroup({_id, participants})
			emitToGroup({
				_id,
				evt: 'addGroupParticipants',
				body: {
					participants, 
					_id
				}
			})
			emitToGroup({_id, evt: 'chatFromGroup', body: {_id, chat: message}})

		})
	})

	socket.on('editGroupDescription', async ({_id, description, message}) => {
		const newDesc = await groupsUtil.saveDescription({desc: description, _id, message})
		emitToGroup({
			_id,
			evt: 'setGroupDesc',
			body: {
				description: newDesc, 
				_id
			}
		})
		emitToGroup({_id, evt: 'chatFromGroup', body: {_id, chat: message}})
	})

	socket.on('handleGroupSettings', async ({_id, settings}) => {
		const updatedSettings = await groupsUtil.saveSettings(_id, settings)
		emitToGroup({
			_id,
			evt: 'setGroupSettings',
			body: {
				_id,
				settings: updatedSettings,
			}
		})
	})

	socket.on('editGroupName', async ({_id, groupName, message}) => {
		await groupsUtil.saveName({_id, groupName, message}, newName => {
			emitToGroup({
				_id,
				evt: 'setGroupName',
				body: {
					name: newName,
					_id
				}
			})

			emitToGroup({_id, evt: 'chatFromGroup', body: {_id, chat: message}})
		})

	})

	socket.on('addAdmin', ({_id, username}) => {
		groupsUtil.addAdmin({_id, username}, admins => {
			emitToGroup({
				_id,
				evt: 'setGroupAdmins',
				body: {
					admins,
					_id
				}
			})
		})
	})

})

module.exports = io

