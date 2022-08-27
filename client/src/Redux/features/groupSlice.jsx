import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchGroupChats = createAsyncThunk('fetchGroupChats', 
	async ({id, _id}) => {
		const response = await fetch(`/chat/fetchGroupChats/${id}/${_id}`)
		if (response.ok) {
			const messages = await response.json()
			return messages
		}
	}
)

const actionValues = {
	reply: {open: false},
	pendingDelete: {},
	starredChat: {},
	typing: [],
	selectedChat: {}
}

const initialState = {
	selectedUsers: [],
	selectedGroup: {},
	selectedChat: {},
	groupChats: [],
	fetchedGroups: []
}

const groupSlice = createSlice({
	name: 'groups',
	initialState,
	reducers: {
		addGroupUser: (state, action) => {
			const {username, pId} = action.payload
			const find = state.selectedUsers.findIndex(i => i.pId === pId)
			if (find === -1) {
				state.selectedUsers.push({username, pId})
			}
		},
		setSelectedGroup: (state, action) => {
			state.selectedGroup = action.payload
		},
		
		unselectUser: (state, action) => {
			const {pId} = action.payload
			const find = state.selectedUsers.findIndex(i => i.pId === pId)
			if (find !== -1) {
				state.selectedUsers.splice(find ,1)
			}
		},
		deleteFetched: (state, action) => {
			const {groupId} = action.payload
			const find = state.fetched.findIndex(i => i._id === groupId)
			if (find !== -1) {
				state.fetched.splice(find, 1)
			}
		},

		setFetchedGroup: (state, action) => {
			state.fetchedGroups.unshift(action.payload)
		},

		setGroupChatReply: (state, action) => {
			const {groupId, reply} = action.payload

		},

		storeSentGroupChat: (state, action) => {
			const {groupId, lastSent, chat} = action.payload
			const find = state.groupChats.findIndex(i => i.groupId === groupId)

			if (find !== -1) {
				state.groupChats[find].messages.push(chat)
			}
		},

		storeReceivedGroupChat: (state, action) => {
			const {_id, chat} = action.payload
			const find = state.groupChats.findIndex(i => i._id === _id)

			if (find !== -1) {
				state.groupChats[find].messages.push(chat)
			}
		},

		setReply: (state, action) => {
			const {open, _id} = action.payload
			const find = state.groupChats.findIndex(i => i._id === _id)
			if (find !== -1) {
				if (open) {
					const {chatId, sender} = action.payload
					const message = state.groupChats[find].messages.find(i => i.chatId === chatId).message
					state.groupChats[find].actionValues.reply = {
						open,
						sender,
						message,
						chatId,
					}
				} else {
					state.groupChats[find].actionValues.reply = {open: false}
				}
			}
		},

		setHighlighted: (state, action) => {
			const {_id, chatId, show} = action.payload
			const find = state.groupChats.findIndex(i => i._id === _id)
			let chatIdx
			if (find === -1) return

			if (find !== -1) {
				chatIdx = state.groupChats[find].messages.findIndex(i => i.chatId === chatId)
			}

			if (show) {
				state.groupChats[find].messages[chatIdx].highlightChat = true
			} else {
				state.groupChats[find].messages[chatIdx].highlightChat = false
			}
		},

		setPendingDelete: (state, action) => {
			const {pendingDelete, _id} = action.payload
			const find = state.groupChats.findIndex(i => i._id === _id)
			if (find !== -1) {
				state.groupChats[find].actionValues.pendingDelete = pendingDelete
			}
		},

		deleteGroup: (state, action) => {
			const groupId = action.payload
			const find = state.groupChats.findIndex(i => i._id === groupId)

			if (find !== -1) {
				state.groupChats.splice(find, 1)
			}
		},

		fetchChatsFromLS: (state, action) => {
			const groupId = action.payload
			let prevGroups = JSON.parse(localStorage.getItem('GroupStateOnExit'))

			if (prevGroups !== null) {
				const idx = prevGroups.groupChats.findIndex(i => i._id === groupId)

				if (idx !== -1) {
					state.groupChats.push(prevGroups.groupChats[idx])
				}
			}
		},

		performGroupChatDelete: (state, action) => {
			const {chatId, _id} = action.payload
			// let prevGroups = JSON.parse(localStorage.getItem('GroupStateOnExit'))

			function del(parent) {
				const find = parent.findIndex(i => i._id === _id)

				if (find !== -1) {
					if (parent[find].actionValues.starredChat.chatId === chatId) {
						parent[find].actionValues.starredChat = {}
					}
					parent[find].actionValues.pendingDelete = {}

					function redoDelete() {
						/** we use forEach because chatId could match 1 or more replied chats,
							so if it finds a match:
								* splice it from messages array
								* re-run the function to refresh the index (i)
						 */
						parent[find].messages.forEach((message, i) => {
							if (message.reply !== undefined && message.reply.open && message.reply.chatId === chatId) {
								parent[find].messages[i].reply.message = ''
							}
							if (message.chatId === chatId) {
								parent[find].messages.splice(i, 1)
								redoDelete()
							}
						})
					}
					redoDelete()
				}
				return parent
			}

			state.groupChats = del(state.groupChats)
			// prevGroups !== null && (prevGroups = del(prevGroups))
			// localStorage.setItem('GroupStateOnExit', JSON.stringify({
			// 	groupChats: prevGroups
			// }))
		},
		setSelectedGroupChat: (state, action) => {
			state.selectedChat = action.payload
		},
		updateGroupTypingStatusInChats: (state, action) => {
			const {_id, username, typing} = action.payload
			const index = state.groupChats.findIndex(i => i._id === _id)

			if (index !== -1) {
				const _typing = state.groupChats[index].actionValues.typing
				const idx = _typing.findIndex(i => i.username === username)
				if (idx !== -1) {
					_typing[idx] = {username, typing}
				} else {
					_typing.push({username, typing})
				}
				state.groupChats[index].actionValues.typing = _typing
			}
		},

		undoPendingDelete: (state, action) => {
			const groupId = action.payload
			const find = state.groupChats.findIndex(i => i._id === groupId)
			if (find !== -1) {
				state.groupChats[find].actionValues.pendingDelete = {}
			}
		},

		setUpdatedField: (state, action) => {
			const {_id, field} = action.payload
			const find = state.groupChats.findIndex(i => i._id === _id)
			if (find !== -1) {
				state.groupChats[find] = {...state.groupChats[find], ...field}
			}

		}
	},
	extraReducers: builder => {
		builder.addCase(fetchGroupChats.pending, (state, action) => {

		})
		.addCase(fetchGroupChats.fulfilled, (state, action) => {
			const find = state.groupChats.findIndex(i => i._id === action.payload._id)
			if (find !== -1) {
				state.groupChats[find] = {actionValues, ...action.payload}
			} else {
				state.groupChats.push({...action.payload, actionValues})
			}
			
		})
	}

})

export const {
	addGroupUser,
	unselectUser,
	setSelectedGroup,
	deleteFetched,
	deleteGroup,
	setFetchedGroup,
	setGroupChatReply,
	storeReceivedGroupChat,
	setPendingDelete,
	performGroupChatDelete,
	undoPendingDelete,
	setReply,
	setUpdatedField,
	fetchChatsFromLS,
	setSelectedGroupChat,
	setHighlighted,
	updateGroupTypingStatusInChats,
	storeSentGroupChat,
} = groupSlice.actions

export default groupSlice.reducer