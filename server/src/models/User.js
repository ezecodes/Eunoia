const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

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
		type: String,
		required: [true, 'Please enter a user name'],
		validate: [value => {
			return !(/[^a-z0-9_]/ig.test(value))
		}, 'Invalid name'],
		index: true,
		unique: true,
	},
	email: {
		type: String, 
		lowercase: true, 
		required: [true, 'Please enter an email'], 
		unique: true
	},
	password: { 
		type: String, 
		required: [true, 'Please enter a strong password'] 
	},
	displayName: {
		type: String, 
		default: ''
	},
	keepLoggedIn: {
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
		type: Date
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

userSchema.pre('save', async function (next) {
	this.password = await bcrypt.hash(this.password, 10)

	this.socials = [{
		name: 'email',
		link: this.email
	}]

	next()
})

userSchema.statics.login = async function (username, password) {
	let user = await this.findOne({username}), passwordsAreEqual
	if (!user) {
		throw Error('Incorrect login credentials')
	}

	if (!await bcrypt.compare(password, user.password)) {
		throw Error('Incorrect login credentials')
	}
	
	return user._id
}

const User = mongoose.model('user', userSchema)
module.exports = User
