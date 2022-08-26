const mongoose = require('mongoose')
const Schema = mongoose.Schema

const socialsSchema = Schema({
	name: {type: String},
	link: {type: String},
	hidden: {type: Boolean, default: true},
}, {_id: false})

const userSchema = Schema({
	pId: {
		type: Schema.Types.ObjectId,
		default: mongoose.Types.ObjectId
	},
	username: {
		required: true, 
		index: {unique: true}, 
		type: String
	},
	displayName: {
		type: String, 
		default: ''
	},
	email: { type: String, 
		lowercase: true, 
		required: true, 
		index: {unique: true}
	},
	password: { 
		type: String, 
		required: true 
	},
	remember: {
		type: Boolean
	},
	bio: {
		type: String, 
		default: ''
	},
	updateNameTimestamp: {
		type: Date
	},
	lastSeen: {
		type: Number
	},
	socials: [socialsSchema],
	notifications: {
		notify: {
			type: Boolean,
			default: true
		},
		sound: {
			type: Boolean,
			default: true
		}
	},
	joined: {type: Date, default: Date.now},
})


const User = mongoose.model('user', userSchema)
module.exports = User
