import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchActiveUsers = createAsyncThunk(
	'fetchActiveUsers', 
	async (id) => {
		const response = await fetch(`/account/users/${id}`)
		if (response.ok) {
			const users = await response.json()
			return users
		}
	}
)

const initialState = {
	activeUsers: [],
	showActiveUsersLoader: false,
	input: '',
	showChips: false
}

const activeUsersSlice = createSlice({
	name: 'activeUsers',
	initialState,
	reducers: {
		setActiveOnline: (state, action) => {
			const users = action.payload
			
			users.forEach(user => {
				const index = state.activeUsers.findIndex(i => i.username === user.username)
				if (index !== -1) {
					state.activeUsers[index].online = true
					let spliced = state.activeUsers.splice(index, 1)
					state.activeUsers.unshift(...spliced)
				}
			})
			
		},
		setActiveDisconnect: (state, action) => {
			const {username} = action.payload
			const index = state.activeUsers.findIndex(i => i.username === username)
			if (index !== -1) {
				state.activeUsers[index].online = false
				state.activeUsers[index].lastSeen = Date.now()
			}
		},

		searchActiveUsers: (state, action) => {
			const input = action.payload
			state.input = input

			state.activeUsers.forEach((a, i) => {
				if (a.username.toLowerCase().includes(input.toLowerCase())) {
					state.activeUsers[i].visible = true
				} else {
					state.activeUsers[i].visible = false
				}
			})
		},
		handleChips: (state, action) => {
			state.showChips = action.payload
		},

		setTypingStatus: (state, action) => {
			const {user, typing} = action.payload
			const find = state.activeUsers.findIndex(i => i.username === user)
			if (find !== -1) {
				state.activeUsers[find].typing = typing
			}
		}
	},
	extraReducers: builder => {
		builder.addCase(fetchActiveUsers.pending, (state, action) => {
			state.showActiveUsersLoader = true
		})
		.addCase(fetchActiveUsers.fulfilled, (state, action) => {
			action.payload.users.forEach(i => {
				i.online = false
				i.visible = true
				i.typing = false
			})
			state.activeUsers = action.payload.users.sort((a, b) => {
				if (a.username.toUpperCase() < b.username.toUpperCase()) return -1
				if (a.username.toUpperCase() > b.username.toUpperCase()) return 1
			})
			state.showActiveUsersLoader = false
		})
	}
})

export const {
	setActiveOnline,
	setActiveDisconnect,
	handleChips,
	setTypingStatus,
	searchActiveUsers
} = activeUsersSlice.actions

export default activeUsersSlice.reducer