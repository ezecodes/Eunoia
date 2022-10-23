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

const { requireAuth } = require('../helpers/auth-helpers')

const chatRoute = express.Router()
chatRoute.all( '*', requireAuth)

chatRoute.get('/fetchMessages/:username', fetchMessages)
chatRoute.get('/fetchGroupInfo/:groupId', fetchGroupInfo)
chatRoute.get('/recentChats', fetchRecentChats)
chatRoute.put('/starConversation/:username', starConversation)
chatRoute.put('/saveUnread/:sender/:chatId', saveUnreadChat)
chatRoute.delete('/clearConversation/:username', clearConversation)

chatRoute.get('/fetchGroupChats/:groupId', fetchGroupChats)

chatRoute.put('/starGroup/:groupId', starGroup)
chatRoute.put('/setGroupUnread', setGroupUnread)
chatRoute.put('/clearGroupUnread', clearGroupUnread)

chatRoute.delete('/deleteGroup/:groupId', deleteGroup)

module.exports = chatRoute