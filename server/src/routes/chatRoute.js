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
chatRoute.put('/starConversation/', starConversation)
chatRoute.put('/saveUnread', saveUnreadChat)
chatRoute.delete('/clearConversation/', clearConversation)

chatRoute.get('/fetchGroupChats/:groupId', fetchGroupChats)

chatRoute.put('/starGroup/:groupId', starGroup)
chatRoute.put('/setGroupUnread', setGroupUnread)
chatRoute.put('/clearGroupUnread', clearGroupUnread)

chatRoute.delete('/deleteGroup', deleteGroup)

module.exports = chatRoute