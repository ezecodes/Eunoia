const express = require('express')

const {
	fetchMessages,
	fetchRecentChats,
	starConversation,
	clearConversation,
	starGroup,
	deleteGroup,
	saveUnreadChat,
	clearGroupUnread,
	fetchGroupInfo,
	setGroupUnread
} = require('../controllers/chat')

const {
	fetchGroupChats,
} = require('../controllers/groups')

const {
	confirmAccess
} = require('../controllers/auth')

const chatRoute = express.Router()

chatRoute.get('/fetchMessages/:userId/:friendsName', fetchMessages)
chatRoute.get('/fetchGroupInfo/:userId/:groupId', fetchGroupInfo)
chatRoute.get('/recentChats/:userId', fetchRecentChats)
chatRoute.put('/starConversation/:userId/:username', starConversation)
chatRoute.put('/saveUnread/:userId/:sender/:chatId', saveUnreadChat)
chatRoute.delete('/clearConversation/:userId/:username', clearConversation)

chatRoute.get('/fetchGroupChats/:userId/:groupId', fetchGroupChats)

chatRoute.put('/starGroup/:userId/:groupId', starGroup)
chatRoute.put('/setGroupUnread/:userId/:groupId/:chatId', setGroupUnread)

chatRoute.delete('/clearGroupUnread/:userId/:groupId', clearGroupUnread)

chatRoute.delete('/deleteGroup/:userId/:groupId', deleteGroup)

// chatRoute.param('userId', confirmAccess)

module.exports = chatRoute