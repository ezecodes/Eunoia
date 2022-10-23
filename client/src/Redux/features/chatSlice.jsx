import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchUserProfile = createAsyncThunk('fetchUserProfile', 
	async ({id, pid}) => {
		const response = await fetch(`/account/profile/${id}/${pid}`)
		if (response.ok) {
			const profile = await response.json()
			return profile
		}
	}
)

const actionValues = {
	pendingDelete: {},
	reply: {open: false},
	selectedChat: {},
	starredChat: {},
	inputValue: '',
	scrollPos: ''
}

const initialState = {
	privateChats: [],
	fetchedProfiles: [],
	showUserProfile: false,
	networkError: false
}

const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		storeSentChat: (state, action) => {

			const {receiver, message} = action.payload

			const find = state.privateChats.findIndex(i => i.username === receiver)

			if (find !== -1) {
				state.privateChats[find].messages.push(message)
			} else {
				state.privateChats.push({username: receiver, messages: [message]})
			}
			// if (state.privateChats[find].messages.length > 15) {
			// 	state.privateChats[find].messages.splice(0, state.privateChats[find].messages.length -1 - 15)
			// }

		},
		storeReceivedChat: (state, action) => {
			const {sender, message} = action.payload

			const find = state.privateChats.findIndex(i => i.username === sender)

			if (find !== -1) {
				state.privateChats[find].messages.push(message)
			} else {
				state.privateChats.push({
					username: sender,
					messages: [message],
					actionValues
				})
			}
			// if (state.privateChats[find].messages.length > 15) {
			// 	state.privateChats[find].messages.splice(0, state.privateChats[find].messages.length -1 - 15)
			// }

		},
		setChatRead: (state, action) => {
			const receiver = action.payload
			const find = state.privateChats.findIndex(i => i.username === receiver)

			if (find !== -1) {
				state.privateChats[find].messages.forEach( i => {
					if (!i.read && i.read !== undefined) {
						i.read = true
					}
				})
			}
		},

		setReply: (state, action) => {
			const {open, friendsName} = action.payload
			const find = state.privateChats.findIndex(i => i.username === friendsName)

			if (open) {
				const {username, chatId, sender} = action.payload

				if (find !== -1) {
					const message = state.privateChats[find].messages.find(i => i.chatId === chatId).message
					state.privateChats[find].actionValues.reply = {
						open,
						sender: sender,
						message: message,
						chatId: chatId
					}
				}
			} else {
				state.privateChats[find].actionValues.reply = {open: false}
			}
		},

		setSelectedChat: (state, action) => {
			state.selectedChat = action.payload
		},

		setUserInput: (state, action) => {
			const {username, value} = action.payload
			const find = state.privateChats.findIndex(i => i.username === username)
			if (find !== -1) {
				state.privateChats[find].actionValues.inputValue = value
			}
		},

		setHighlighted: (state, action) => {
			const {friendsName, chatId, show} = action.payload
			const find = state.privateChats.findIndex(i => i.username === friendsName)

			if (show) {
				if (find !== -1) {
					state.privateChats[find].messages.find(i => i.chatId === chatId).highlightChat = true
				}
			} else {
				state.privateChats[find].messages.find(i => i.chatId === chatId).highlightChat = false
			}
		},

		setReaction: (state, action) => {
			const {reaction, chatId, friendsName} = action.payload
			const find = state.privateChats.findIndex(i => i.username === friendsName)

			if (find !== -1) {
				state.privateChats[find].messages.find(i => i.chatId === chatId).reaction = reaction
			}
		},

		handleStarredChat: (state, action) => {
			const {friendsName, starredChat} = action.payload
			const find = state.privateChats.findIndex(i => i.username === friendsName)
			if (find !== -1) {
				state.privateChats[find].actionValues.starredChat = starredChat
			}
			
		},

		clearChats: (state, action) => {
			const friendsName = action.payload
			const find = state.privateChats.findIndex(i => i.username === friendsName)

			if (find !== -1) {
				state.privateChats.splice(find, 1)
			}
		},

		setPendingDelete: (state, action) => {
			const {friendsName, chat} = action.payload
			const find = state.privateChats.findIndex(i => i.username === friendsName)

			if (find !== -1) {
				if (Object.keys(state.privateChats[find].actionValues.pendingDelete).length === 0) {
					state.privateChats[find].actionValues.pendingDelete = chat
				}
			}

		},
		undoPendingDelete: (state, action) => {
			const {friendsName} = action.payload
			const find = state.privateChats.findIndex(i => i.username === friendsName)

			if (find !== -1) {
				state.privateChats[find].actionValues.pendingDelete = {}
			}

		},
		performChatDelete: (state, action) => {
			const {friendsName, chatId} = action.payload

			const find = state.privateChats.findIndex(i => i.username === friendsName)

			if (find !== -1) {
				state.privateChats[find].actionValues.pendingDelete = {}

				function redoDelete() {
					/** we use forEach because chatId could match 1 or more replied chats,
						so if it finds a match:
							* splice it from messages array
							* re-run the function to refresh the index (i)
					 */
					state.privateChats[find].messages.forEach((message, i) => {
						if (message.reply.chatId === chatId) {
							state.privateChats[find].messages[i].reply.message = ''
						}
						if (message.chatId === chatId) {
							state.privateChats[find].messages.splice(i, 1)
							redoDelete()
						}
					})
				}
				redoDelete()
				
			}
		},
		setUserProfile: (state, action) => {
			state.showUserProfile = action.payload
		},
		storeMessages: (state, action) => {
			state.networkError= false
			const { username, messages, starredChat } = action.payload

			const idx = state.privateChats.findIndex( chat => chat.username === username)
			
			if (idx === -1) {
				state.privateChats.push({
					username,
					messages,
					actionValues: {...actionValues, starredChat},
					profile: {}
				})
			} else {
				state.privateChats[idx] = {messages, actionValues, username, starredChat, profile: {}}
			}
		},

		storeUserProfile: (state, action) => {
			const { profile } = action.payload
			const idx = state.privateChats.findIndex( chat => chat.username === profile.username)
			state.privateChats[idx].profile = profile
		}
	},
	extraReducers: builder => {
		
	}
})

export const {
	storeSentChat,
	setHighlighted,
	storeReceivedChat,
	setChatRead,
	setUserInput,
	setReaction,
	clearChats,
	storeMessages,
	handleStarredChat,
	performChatDelete,
	setPendingDelete,
	setSelectedChat,
	undoPendingDelete,
	setUserProfile,
	setReply
} = chatSlice.actions

export default chatSlice.reducer