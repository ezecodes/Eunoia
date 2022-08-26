const mongoose = require('mongoose')

const schema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		default: mongoose.Types.ObjectId
	},
	name: String,
	createdAt: {type: Date, default: Date.now},
	admins: [{
		username: {
			type: String,
			index: {
				unique: true
			}, 
		} 
	}],
	createdBy: {
		username: { type: String}
	},
	description: {type: String, default: ''},
	participants: [{
		username: {
			type: String,
			index: {
				unique: true
			}, 
		}
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