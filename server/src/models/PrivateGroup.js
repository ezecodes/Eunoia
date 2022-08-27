const mongoose = require('mongoose')

const schema = new mongoose.Schema({
	name: String,
	createdAt: {type: Date, default: Date.now},
	admins: [{
		username: String
	}],
	createdBy: {
		username: { type: String}
	},
	description: {type: String, default: ''},
	participants: [{
		username: String
	}],
	settings: {
		allowEditForAdminsOnly: {type: Boolean, default: true},
		allowChatForAdminsOnly: {type: Boolean, default: false}
	},
	messages: [{
		type: {type: String},
		sender: String,
		message: String,
		chatId: Number,
		reply: {},
		timestamp: {}
	}]
})

const PrivateGroup = mongoose.model('privateGroup', schema)
module.exports = PrivateGroup