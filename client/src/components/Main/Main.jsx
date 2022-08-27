import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import {
	fetchRecentChats, 
	setUnread, 
	updateRecentChats, 
	syncRecentsWithDeleted, 
	fetchSpecificField,
	syncRecentsWithRead,
	updateRecentGroupChats,
	updateGroupTypingStatusInRecent, 
	updateUserTypingStatus,
	syncRecentGroupWithDeleted,
 	fetchGroupInfo,
	setGroupUnread,
	saveGroupNameInRecent
} from '../../Redux/features/recentChatsSlice'

import { fetchActiveUsers, setActiveOnline, setActiveDisconnect, setTypingStatus } from '../../Redux/features/activeUsersSlice'

import { fetchAccountData, setOnline } from '../../Redux/features/accountSlice'

import { storeReceivedChat, setChatRead, handleStarredChat, performChatDelete } from '../../Redux/features/chatSlice'

import { handleDisconnectedUser, setOnlineUsers} from '../../Redux/features/socketSlice'
import { setComponents} from '../../Redux/features/componentSlice'
import { 
	storeReceivedGroupChat,
	performGroupChatDelete, 
 	updateGroupTypingStatusInChats,
 	removeGroupUser,
 	addGroupMembers,
 	leaveGroup,
	setUpdatedField,
 	fetchGroupChats
 } from '../../Redux/features/groupSlice'

import { assert, handleFetch } from '../../lib/script'
import init, { socket } from '../../sockets/init'
import LeftPane from './leftPane/LeftPane'

const useStyles = makeStyles({
	main: {
		background: 'linear-gradient(266deg, #e9e9e9, #d3920026)' ,
		display: 'flex',
		height: '100%'
	}
})

const Main = () => {
	const {id, username} = JSON.parse(localStorage.getItem('details'))
	const classes = useStyles()
	const dispatch = useDispatch()
	const selectedUser = useSelector(state => state.other.currentSelectedUser)
	const {leftPane, rightPane} = useSelector(state => state.components)
	const activeUsers = useSelector(state => state.activeUsers.activeUsers)
	const selectedGroup = useSelector(state => state.groups.selectedGroup)

	const { useEffect } = React
	useEffect(() => {
		// automatically refresh the page when the account details changed
		if (!assert(JSON.parse(localStorage.getItem('details')))) {
			document.location = '/'
		}
	}, [JSON.parse(localStorage.getItem('details'))])

	useEffect(() => {
		init({token: id, username})

		// emit 'getOnlineUsers after fetch to prevent conflict'
		dispatch(fetchAccountData(id))
		dispatch(fetchRecentChats(id)).then(() => socket.emit('getOnileUsers'))
		dispatch(fetchActiveUsers(id)).then(() => socket.emit('getOnileUsers'))
	}, [])

	socket.off('connect').on('connect', () => {
		dispatch(setOnline(true))
	})
	socket.off('disconnect').on('disconnect', reason => {
		dispatch(setOnline(false))
	})

	socket.off('onlineUsers').on('onlineUsers', users => {
		dispatch(setActiveOnline(users.filter(user => user.username !== username)))
		dispatch(setOnlineUsers(users.filter(user => user.username !== username)))
	})
	socket.off('userDisconnect').on('userDisconnect', user => {
		dispatch(setActiveDisconnect(user))
		dispatch(handleDisconnectedUser(user))
	})

	socket.off('starredChat').on('starredChat', (starredBy, starredChat) => {
		dispatch(handleStarredChat({friendsName: starredBy, starredChat}))
	})
	socket.off('deleteChat').on('deleteChat', obj => {
		dispatch(performChatDelete(obj))
		dispatch(syncRecentsWithDeleted(obj))
	})

	socket.off('fetchGroupInfo').on('fetchGroupInfo', ({_id}) => {
		dispatch(fetchGroupInfo({token: id, _id}))
	})

	socket.off('setGroupSettings').on('setGroupSettings', ({_id, settings}) => {
		dispatch(setUpdatedField({_id, field: {settings}}))
	})
	socket.off('setGroupDesc').on('setGroupDesc', ({_id, description}) => {
		dispatch(setUpdatedField({_id, field: {description}}))
	})
	socket.off('setGroupName').on('setGroupName', ({_id, name}) => {
		dispatch(fetchGroupInfo({token: id, _id}))
		dispatch(setUpdatedField({_id, field: {name}})) 
	})
	socket.off('setGroupAdmins').on('setGroupAdmins', ({_id, admins}) => {
		dispatch(setUpdatedField({_id, field: {admins}})) 
	})
	socket.off('addGroupParticipants').on('addGroupParticipants', ({_id, participants}) => {
		dispatch(fetchGroupInfo({token: id, _id}))
		dispatch(setUpdatedField({_id, field: {participants}}))
	})
	socket.off('removeGroupUser').on('removeGroupUser', ({_id, participants, admins}) => {
		dispatch(setUpdatedField({_id, field: {participants, admins}}))
	})

	socket.off('chatFromGroup').on('chatFromGroup', ({_id, chat}) => {
		dispatch(storeReceivedGroupChat({_id, chat}))
		dispatch(updateRecentGroupChats({_id, lastChat: chat}))

		if ((assert(selectedGroup) && selectedGroup._id !== _id) || !assert(selectedGroup)) {
			handleFetch(
				`chat/setGroupUnread/${id}/${_id}/${chat.chatId}`,
				'put'
			)
			dispatch(setGroupUnread({_id, chatId: chat.chatId}))
		} 
	})

	socket.off('deleteGroupChat').on('deleteGroupChat', ({_id, chatId}) => {
		dispatch(performGroupChatDelete({_id, chatId}))
		dispatch(syncRecentGroupWithDeleted({_id, chatId}))
	})

	socket.off('groupTyping').on('groupTyping', ({_id, username, typing}) => {
		dispatch(updateGroupTypingStatusInChats({_id, username, typing}))
		dispatch(updateGroupTypingStatusInRecent({_id, username, typing}))
	})

	socket.off('chatFromUser').on('chatFromUser', chat => {
		function handleDispatch() {
			dispatch(storeReceivedChat(chat))
			dispatch(updateRecentChats({
				username: chat.sender,
				lastChat: chat.message,
			}))
		}

		if (activeUsers.find(i => i.username === chat.sender) !== undefined) {
			handleDispatch()
		} else {
			dispatch(fetchActiveUsers(id)).then(() => {
				socket.emit('getOnileUsers')
				handleDispatch()
			})

		}

		if (!assert(selectedUser) || selectedUser.username !== chat.sender) {
			handleFetch(
				`chat/saveUnread/${id}/${chat.sender}/${chat.message.chatId}`,
				'put',
			)
			dispatch(setUnread({friendsName: chat.sender, chatId: chat.message.chatId}))
		}
		if (assert(selectedUser) && selectedUser.username === chat.sender) {
			socket.emit('chatIsRead', {
				sender: selectedUser.username,
				receiver: username,
			})
		}
	})

	socket.off('chatHasBeenRead').on('chatHasBeenRead', ({sender, receiver}) => {
		dispatch(setChatRead(receiver))
		dispatch(syncRecentsWithRead(receiver))
	})

	socket.off('userIsTyping').on('userIsTyping', obj => {
		dispatch(updateUserTypingStatus(obj))
		dispatch(setTypingStatus(obj))
	})

	return (
		<section className={classes.main} >
			{leftPane && <LeftPane />}
			<Outlet />
		</section>
	)
}

export default Main