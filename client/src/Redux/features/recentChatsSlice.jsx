import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchRecentChats = createAsyncThunk(
	'fetchRecentChats',
	async (id) => {
		const response = await fetch(`/chat/recentChats/${id}`)
		if (response.ok) {
			const recentChats = await response.json()
			return recentChats
		}
	}
)
export const fetchGroupInfo = createAsyncThunk(
	'fetchGroupInfo',
	async ({token, _id}) => {
		const response = await fetch(`/chat/fetchGroupInfo/${token}/${_id}/`)
		if (response.ok) {
			const specific = await response.json()
			return specific
		}
	}
)

function traverse(arr) {
	let starred = []
	arr.forEach((chat, i) => {
		if (chat.isStarred.value) {
			starred.push(chat)
		}
	})

	starred.sort((a,b) => {
		if (a.isStarred.date > b.isStarred.date) return -1
		else return 1
	})

	arr = arr.filter(i => !i.isStarred.value)

	arr.sort((a,b) => {
		if (a.lastSent > b.lastSent) return -1
		else return 1

	})
	

	arr = [...starred, ...arr]

	return arr
}

const defaultStates = {
	typing: false,
	visible: true,
	isStarred: {value: false},
}

const initialState = {
	recentChats: [],
	chatToBeCleared: {},
	groupToBeDeleted: {},
	input: '',
	showRecentUsersLoader: false
}

const recentChatsSlice = createSlice({
	name: 'recentChats',
	initialState,
	reducers: {
		setRecentOnline: (state, action) => {
			const users = action.payload
			
			users.forEach(user => {
				const index = state.recentChats.findIndex(i => i.username === user.username)
				if (index !== -1) {
					state.recentChats[index].online = true
				}
			})
		},
		setRecentDisconnect: (state, action) => {
			const {username} = action.payload
			const index = state.recentChats.findIndex(i => i.username === username)
			if (index !== -1) {
				state.recentChats[index].online = false
				state.recentChats[index].lastSeen = Date.now()
			}
		},

		updateUserTypingStatus: (state, action) => {
			const {user, typing} = action.payload
			const find = state.recentChats.findIndex(i => i.username === user)
			if (find !== -1) {
				state.recentChats[find].typing = typing
			}
		},

		resetUnread: (state, action) => {
			const username = action.payload
			const find = state.recentChats.findIndex(i => i.username === username)

			if (find !== -1) {
				state.recentChats[find].unread = []
			}
		},
		setUnread: (state, action) => {
			const {friendsName, chatId} = action.payload
			const find = state.recentChats.findIndex(i => i.username === friendsName)

			if (find !== -1) {

				state.recentChats[find].unread.push(chatId)
			}
			
		},
		updateRecentChats: (state, action) => {
			const {lastChat, username} = action.payload
			const index = state.recentChats.findIndex(i => i.username === username)
			const lastSent = new Date(lastChat.timestamp.fullDate).getTime()

			if (index !== -1) {
				state.recentChats[index].lastSent = lastSent
				state.recentChats[index].lastChat = lastChat

			} else {
				action.payload = {...action.payload, ...defaultStates, online: true}
				action.payload.lastSent = lastSent
				state.recentChats.unshift(action.payload)
			}
			
			state.recentChats = traverse(state.recentChats)

		},
		syncRecentsWithDeleted: (state, action) => {
			const {friendsName, chatId} = action.payload
			const find = state.recentChats.findIndex(i => i.username === friendsName)

			if (find !== -1) {
				const findInUnread = state.recentChats[find].unread.findIndex(i => i === chatId)
				if (findInUnread !== -1) {
					state.recentChats[find].unread.splice(findInUnread, 1)
				}
				if (state.recentChats[find].lastChat.chatId === chatId) {
					state.recentChats[find].lastChat = {}
				}
			}
		},
		syncRecentGroupWithDeleted: (state, action) => {
			const {_id, chatId} = action.payload
			const find = state.recentChats.findIndex(i => i.chatType === 'group' && i._id === _id)

			if (find !== -1) {
				const findInUnread = state.recentChats[find].unread.findIndex(i => i === chatId)
				if (findInUnread !== -1) {
					state.recentChats[find].unread.splice(findInUnread, 1)
				}
				if (state.recentChats[find].lastChat.chatId === chatId) {
					state.recentChats[find].lastChat = {}
				}
			}
		},
		updateRecentGroupChats: (state, action) => {
			const {_id, lastChat} = action.payload
			const index = state.recentChats.findIndex(i => i.chatType === 'group' && i._id === _id)
			if (index !== -1) {
				state.recentChats[index].lastSent = new Date(lastChat.timestamp.fullDate).getTime()
				state.recentChats[index].lastChat = lastChat
			}
			state.recentChats = traverse(state.recentChats)

		},

		updateGroupField: (state, action) => {
			const {_id, field} = action.payload

			const find = state.recentChats.findIndex(i => i.chatType === 'group' && i._id === _id)

			if (find) {
				state.recentChats[find] = {...state.recentChats[find], ...field}
			}

		},

		updateGroupTypingStatusInRecent: (state, action) => {
			const {_id, username, typing} = action.payload
			const find = state.recentChats.findIndex(i => i.chatType === 'group' && i._id === _id)
			let idx

			if (find !== -1) {

				idx = state.recentChats[find].typing.findIndex(i => i.username === username)

				if (idx !== -1) {
					state.recentChats[find].typing[idx].typing = typing
				} 
				if (idx === -1) {
					state.recentChats[find].typing.unshift({typing, username})
				}
			}
		},

		handleStarred: (state, action) => {
			const {friendsName, isStarred} = action.payload
			const find = state.recentChats.findIndex(i => i.username === friendsName)

			if (find !== -1) {
				state.recentChats[find].isStarred = isStarred
			}

			state.recentChats = traverse(state.recentChats)
		},

		starGroup: (state, action) => {
			const {_id, starredObj} = action.payload
			const find = state.recentChats.findIndex(i => i.chatType === 'group' && i._id === _id)

			if (find !== -1) {
				state.recentChats[find].isStarred = starredObj
			}
			state.recentChats = traverse(state.recentChats)
			
		},

		clearConversation: (state, action) => {
			const friendsName = action.payload
			const find = state.recentChats.findIndex(i => i.username === friendsName)
			if (find !== -1) {
				state.recentChats.splice(find, 1)
			}
		},
		syncRecentsWithRead: (state, action) => {
			const receiver = action.payload
			const find = state.recentChats.findIndex(i => i.username === receiver)

			if (find !== -1) {
				state.recentChats[find].lastChat.read = true
			}
		},

		alertBeforeClear: (state, action) => {
			state.chatToBeCleared = action.payload
		},
		alertGroupDeletion: (state, action) => {
			state.groupToBeDeleted = action.payload
		},

		setGroupUnread: (state, action) => {
			const {_id, chatId} = action.payload
			const find = state.recentChats.findIndex(i => i.chatType === 'group' && i._id === _id)
			if (find !== -1) {
				state.recentChats[find].unread.unshift(chatId)
			}
		},

		saveGroupNameInRecent: (state, action) => {
			// const {_id, name} = action.payload
			// const find = state.recentChats.findIndex(i => i.chatType === 'group' && i.group.groupId === groupId)
			// if (find !== -1) {
			// 	state.recentChats[find].group.groupName = groupName
			// }
		},

		exitGroup: (state, action) => {
			const _id = action.payload
			const find = state.recentChats.findIndex(i => i.chatType === 'group' && i._id === _id)
			if (find !== -1) {
				state.recentChats.splice(find, 1)
			}
		},

		searchRecentChats: (state, action) => {
			const input = action.payload
			state.input = input
			
			state.recentChats.forEach((a, i) => {
				if (a.chatType === 'group') {
					if (a.name.toLowerCase().includes(input.toLowerCase())) {
						state.recentChats[i].visible = true
					} else {
						state.recentChats[i].visible = false
					}
				}
				if (a.chatType === 'user') {
					if (a.username.toLowerCase().includes(input.toLowerCase())) {
						state.recentChats[i].visible = true
					} else {
						state.recentChats[i].visible = false
					}
				}
			})
		}
	},
	extraReducers: builder => {
		builder.addCase(fetchRecentChats.pending, (state, action) => {
			state.showRecentUsersLoader = true
		})
		.addCase(fetchRecentChats.fulfilled, (state, action) => {
			let allChats = action.payload.recentChats
			allChats.forEach((obj, i) => {
				if (obj.chatType === 'group') {
					allChats[i] = {
						...obj,
						typing: [],
					}
				} else {
					allChats[i] = {
						...obj,
						typing: false
					}
				}

				if (obj.messages) {
					allChats[i].lastChat = obj.messages[0] || {}
				}
				allChats[i].visible = true
				delete allChats[i].messages
			})

			state.recentChats = traverse(allChats)
			state.showRecentUsersLoader = false
		})
		.addCase(fetchGroupInfo.fulfilled, (state, action) => {
			let modifiedGroup = action.payload

			const find = state.recentChats.findIndex(i => i.chatType === 'group' && i._id === modifiedGroup._id)

			if (find !== -1) {
				state.recentChats[find] = {
					...state.recentChats[find],
					...modifiedGroup,
				}
			} else {
				state.recentChats.push({
					typing: [],
					visible: true,
					...modifiedGroup
				})
			}

			state.recentChats = traverse(state.recentChats)
		})
	}
})

export const {
	search,
	setRecentOnline,
	resetUnread,
	handleStarred,
	clearConversation,
	alertGroupDeletion,
	alertBeforeClear,
	setUnread,
	syncRecentsWithDeleted,
	searchRecentChats,
	updateRecentChats,
	syncRecentsWithRead,
	saveGroupNameInRecent,
	updateUserTypingStatus,
	setGroupUnread,
	updateRecentGroupChats,
	updateGroupTypingStatusInRecent,
	exitGroup,
	updateGroupField,
	syncRecentGroupWithDeleted,
	starGroup,
	setRecentDisconnect
} = recentChatsSlice.actions

export default recentChatsSlice.reducer