import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import { useWinHeight } from '../../hooks/hooks'
import {
	storeRecentChats,
	setUnread, 
	updateRecentChats, 
	syncRecentsWithDeleted, 
	fetchSpecificField,
	syncRecentsWithRead,
	updateRecentGroupChats,
	updateGroupTypingStatusInRecent, 
	updateUserTypingStatus,
	syncRecentGroupWithDeleted,
	storeGroupUnread,
	storeGroupInfo,
	saveGroupNameInRecent
} from '../../Redux/features/recentChatsSlice'

import { storeActiveUsers, setActiveOnline, setActiveDisconnect, setTypingStatus } from '../../Redux/features/activeUsersSlice'

import { storeAccountData, setOnline } from '../../Redux/features/accountSlice'

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

import { getAccountData } from '../../api/account'
import { getRecentChats } from '../../api/recent-chat'
import { getActiveUsers } from '../../api/active-users'
import { fetchGroupInfo, setGroupUnread } from '../../api/group-chat'
import { saveUnreadChat } from '../../api/chat'

const useStyles = makeStyles({
	main: {
		background: 'linear-gradient(266deg, #e9e9e9, #d3920026)' ,
		display: 'flex',
		height: '100%'
	}
})

const Main = ({user}) => {
	const {id, username} = useSelector(state => state.account.account)
	const classes = useStyles()
	const dispatch = useDispatch()
	const selectedUser = useSelector(state => state.other.currentSelectedUser)
	const {leftPane, rightPane} = useSelector(state => state.components)
	const activeUsers = useSelector(state => state.activeUsers.activeUsers)
	const selectedGroup = useSelector(state => state.groups.selectedGroup)
	const fetchedUsers = useSelector(state => state.other.fetched)
	const fetchedGroups = useSelector(state => state.groups.fetchedGroups)
	const winHeight = useWinHeight()

	const { useEffect } = React

	useEffect(() => {
		init({token: id, username})

		getAccountData((res) => {
			dispatch(storeAccountData(res))
		})
		getRecentChats(res => {
			dispatch(storeRecentChats(res))
			socket.emit('getOnileUsers')
		})
		getActiveUsers(res => {
			dispatch(storeActiveUsers(res))
			socket.emit('getOnileUsers')
		})
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
		fetchGroupInfo(_id, res => {
			dispatch(storeGroupInfo(res))
		})
	})

	socket.off('setGroupSettings').on('setGroupSettings', ({_id, settings}) => {
		dispatch(setUpdatedField({_id, field: {settings}}))
	})
	socket.off('setGroupDesc').on('setGroupDesc', ({_id, description}) => {
		dispatch(setUpdatedField({_id, field: {description}}))
	})
	socket.off('setGroupName').on('setGroupName', ({_id, name}) => {
		fetchGroupInfo(_id, res => {
			dispatch(storeGroupInfo(res))
		})
		dispatch(setUpdatedField({_id, field: {name}})) 
	})
	socket.off('setGroupAdmins').on('setGroupAdmins', ({_id, admins}) => {
		dispatch(setUpdatedField({_id, field: {admins}})) 
	})
	socket.off('addGroupParticipants').on('addGroupParticipants', ({_id, participants}) => {
		fetchGroupInfo(_id, res => {
			dispatch(storeGroupInfo(res))
		})
		dispatch(setUpdatedField({_id, field: {participants}}))
	})
	socket.off('removeGroupUser').on('removeGroupUser', ({_id, participants, admins}) => {
		dispatch(setUpdatedField({_id, field: {participants, admins}}))
	})

	socket.off('chatFromGroup').on('chatFromGroup', ({_id, chat}) => {
		dispatch(storeReceivedGroupChat({_id, chat}))

		if ((assert(selectedGroup) && selectedGroup._id !== _id) || !assert(selectedGroup)) {
			sendGroupUnread({groupId: _id, chatId: chat.chatId})
			dispatch(setGroupUnread({_id, chatId: chat.chatId}))
		} 
		
		if (fetchedGroups.some(i => i === _id)) return  
		dispatch(updateRecentGroupChats({_id, lastChat: chat}))
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

			/// checks if messages with the sender has been fetched, else update recentChats
			// N/B updateRecentChats is also called/referenced at messages useEffect
			if (fetchedUsers.some(i => i.username === chat.sender)) return  

			dispatch(updateRecentChats({
				username: chat.sender,
				lastChat: chat.message,
			}))
		}

		if (activeUsers.find(i => i.username === chat.sender) !== undefined) {
			handleDispatch()
		} else {
			getActiveUsers(res => {
				storeActiveUsers(res)
				socket.emit('getOnileUsers')
				handleDispatch()
			})
		}

		if (!assert(selectedUser) || selectedUser.username !== chat.sender) {
			saveUnreadChat({sender: chat.sender, chatId: chat.message.chatId})
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
		<section className={classes.main} style={{
			height: winHeight + 'px'
		}}>
			{leftPane && <LeftPane />}
			<Outlet />
		</section>
	)
}

export default Main