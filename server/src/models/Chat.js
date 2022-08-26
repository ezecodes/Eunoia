const mongoose = require('mongoose')

const Schema = mongoose.Schema

const chatSchema = Schema({
	_id: Schema.Types.ObjectId,
	username: String,
	groups: [
		{	
			_id: {
				type: Schema.Types.ObjectId,
			},
			name: String,
			 isStarred: {
				value: {type: Boolean, default: false},
				date: {type: Number}
			},
			chatType: {type: String, default: 'group'},
			isNull: {type: Boolean, default: false},
			lastSent: {type: Number, },
			unread: {type: Array, default: []},
			lastChat: {type: Object, default: {}}
		}
	],
	chats: [
		{
			pId: Schema.Types.ObjectId,
			username: String,
			isStarred: {
				value: {type: Boolean, default: false},
				date: {type: Number}
			},
			chatType: {type: String, default: 'user'},
			lastSent: Number,
			unread: {type: Array, default: []},
			messages: [{
				message: String,
				sender: String,
				receiver: String,
				chatId: Number,
				read: Boolean,
				reply: {},
				timestamp: {}
			}]
		}
	]
})

const Chat = mongoose.model('chat', chatSchema)
module.exports = Chat
