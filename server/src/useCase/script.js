const Chat = require('../models/Chat.js')
const User = require('../models/User.js')
const PrivateGroup = require('../models/PrivateGroup.js')

const userUtil = {
	setLastSeen: async (id) => {
		await User.findOneAndUpdate({_id: id}, {lastSeen: Date.now()})
	},
}

const unreadUtil = {
	reset: async function ({sender, receiver}) {
		// This method resets unread array and sets a message read to true
		await Chat.findOneAndUpdate(
			{username: receiver, 'chats.username': sender},
			{
				'chats.$.unread': []
			}
		)
		await Chat.findOneAndUpdate(
			{username: sender, 'chats.username': receiver},
			{
				'$set': {
					'chats.$.messages.$[message].read': true,
				},
			}, 
			{arrayFilters: [{'message.read': false}]}
		)
	}
}

const groupsUtil = {
	createGroup: async (groupDetails) => {
		const {name, createdBy, createdAt, participants, admins, messages} = groupDetails
		const newGroup = await PrivateGroup.create({
			name,
			createdBy,
			participants,
			messages,
			admins,
			createdAt,
		}, {new: true, upsert: true})

		participants.forEach( async user => {
			await Chat.findOneAndUpdate({username: user.username}, {
				$push: {
					groups: {
						_id: newGroup[0].id,
						name: newGroup[0].name,
						lastChat: messages.at(-1),
						unread: [...messages.map(i => i.chatId)]
					}
				}
			})
		})
		return newGroup[0].id
	},

	fetchParticipants: async (groupId) => {
		const fetchGroup = await PrivateGroup.findOne({_id: groupId}, 
			{_id: 0, participants: 1
		})
		if (fetchGroup) return fetchGroup.participants
		else return []
	},

	saveUnread: async ({id, _id, chatId}) => {
		await Chat.findOneAndUpdate({_id: _id, 'groups._id': _id}, {
			$push: {
				'groups.$.unread': chatId
			}
		})
	},

	addAdmin: async ({groupId, username}) => {
		await PrivateGroup.findOne({_id: groupId})
		.exec((err, docs) => {
			if (docs !== null && docs.createdBy.username !== username) {
				const find = docs.admins.findIndex(i => i.username === username)
				if (find === -1) {
					docs.admins.push({username})
				} else {
					docs.admins.splice(find, 1)
				}
				docs.save()
			}
		})
	},

	clearUnread: async ({id, _id}) => {
		await Chat.findOneAndUpdate({_id: id, 'groups._id': _id}, {
			'groups.$.unread': []
		})
	},
	saveChat: async ({_id, chat}) => {
		await PrivateGroup.findByIdAndUpdate(_id, {
			$push: {
				messages: chat
			}
		})

	},

	saveSettings: async ({groupId, settings}) => {
		await PrivateGroup.findByIdAndUpdate(groupId, {
			settings: settings
		})
	},

	saveName: async (creator, {_id, groupName, message}) => {
		await PrivateGroup.findOne({_id: _id})
		.exec((err, docs) => {
			if (docs === null || docs === undefined) return false

			docs.name = groupName
			docs.messages.push(message)

			docs.participants.forEach( async ({username}) => {
				await Chat.findOneAndUpdate({username: username, 'groups._id': _id}, {
					'groups.$.name': groupName
				})
			})
			docs.save()
		})
	},

	removeGroupUser: async ({_id, username, message}, cb) => {
		await Chat.findOneAndUpdate({username: username, 'groups._id': _id}, {
			'groups.$.isNull': true
		})
		const participants = await PrivateGroup.findByIdAndUpdate(_id, {
			$pull: {
				participants: {username},
				admins: {username}
			},
			$push: {
				messages: message
			}
		}, {new: true})
		
		console.log(participants)

	},

	addGroupMembers: async ({_id, members, message}, cb) => {
		const find = await PrivateGroup.findById(_id, {_id: 0, name: 1})

		members.forEach( async ({username}) => {
			await Chat.findOneAndUpdate({username: username}, {
				$push: {
					groups: {
						_id,
						name: find.name,
						lastChat: message,
						unread: [message.chatId]
					}
				}
			})
		})

		await PrivateGroup.findOne({_id: _id})
		.exec((err, docs) => {
			if (!docs && !err) return

			members.forEach(({username}) => {
				docs.participants = docs.participants.filter(i => i.username !== username)
			})
			docs.participants.push(...members)
			docs.messages.push(message)
			docs.save()
			cb(docs.participants)
		})
	},

	saveDescription: async ({groupId, description, message}) => {

		await PrivateGroup.findByIdAndUpdate(groupId, {
			description: description,
			$push: {
				messages: message
			}
		})
	},

	deleteForAll: async ({_id, chatId}) => {
		await PrivateGroup.findByIdAndUpdate(_id, {
			$pull: {
				messages: {chatId: chatId}
			}
		})
		await PrivateGroup.findByIdAndUpdate(_id,
			{'$set': {'messages.$[message].reply.message': ''}}, 
			{arrayFilters: [{'message.reply.chatId': chatId}]}
		)

	}, 
}

const chatsUtil = {
	save: async function ({user1, user2, lastSent, message}) {
		const user1Id = await User.findOne({username: user1}, {_id: 1})
		const user2Id = await User.findOne({username: user2}, {_id: 1})
		if (!user1Id || !user2Id) return false

		const newChatObj = {
			id: user2Id.id,
			username: user2,
			lastSent,
			messages: [message]
		}

		await Chat.findOne({username: user1})
		.exec(async (err, docs) => {
			if (docs !== null) {
				const find = docs.chats.findIndex(i => i.username === user2)
				if (find !== -1) {
					docs.chats[find].messages.push(message)
					docs.chats[find].lastSent = lastSent
				} else {
					docs.chats.push(newChatObj)
				}
				docs.save()
			} else {
				await Chat.create({
					_id: user1Id.id,
					username: user1,
					chats: [newChatObj]
				})
			}
		})
	},
	deleteForAll: async function ({deletedBy, friendsName, sender, chatId}) {
		if (deletedBy !== sender) return false

		await Chat.findOneAndUpdate(
			{username: friendsName, 'chats.username': deletedBy},
			{
				$pull: {
					'chats.$.messages': {chatId: chatId},
					'chats.$.unread': chatId
				},
			}
		)
		await Chat.findOneAndUpdate(
			{username: deletedBy, 'chats.username': friendsName},
			{
				$pull: {
					'chats.$.messages': {chatId: chatId},
					'chats.$.unread': chatId
				},
			}
		)

		await Chat.findOneAndUpdate(
			{username: deletedBy, 'chats.username': friendsName},
			{'$set': {'chats.$.messages.$[message].reply.message': ''}}, 
			{arrayFilters: [{'message.reply.chatId': chatId}]}
		)
		await Chat.findOneAndUpdate(
			{username: friendsName, 'chats.username': deletedBy},
			{'$set': {'chats.$.messages.$[message].reply.message': ''}}, 
			{arrayFilters: [{'message.reply.chatId': chatId}]}
		)


	},
	deleteForOne: async function ({deletedBy, friendsName, chatId, sender}) {
		await Chat.findOneAndUpdate(
			{username: deletedBy, 'chats.username': friendsName},
			{
				$pull: {
					'chats.$.messages': {chatId: chatId},
				},
			},
		)
		await Chat.findOneAndUpdate(
			{username: deletedBy, 'chats.username': friendsName},
			{'$set': {'chats.$.messages.$[message].reply.message': ''}}, 
			{arrayFilters: [{'message.reply.chatId': chatId}]}
		)
	}
}


module.exports = {
	userUtil, chatsUtil, unreadUtil, groupsUtil
}