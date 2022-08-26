import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	onlineUsers: [],

}

const socketSlice = createSlice({
	name: 'socketActivity',
	initialState,
	reducers: {
		setOnlineUsers: (state, action) => {
			const users = action.payload

			users.forEach(user => {
				const index = state.onlineUsers.findIndex(i => i.username === user.username)
				user.online = true

				if (index !== -1) {
					state.onlineUsers[index].online = true
				} else {
					state.onlineUsers.push(user)
				}
			})
		},
		handleDisconnectedUser: (state, action) => {
			const {username} = action.payload
			const index = state.onlineUsers.findIndex(i => i.username === username)
			if (index !== -1) {
				state.onlineUsers[index].online = false
				state.onlineUsers[index].lastSeen = Date.now()
			}
		},
	}
})

export default socketSlice.reducer

export const {
	setOnlineUsers,
	handleDisconnectedUser
} = socketSlice.actions