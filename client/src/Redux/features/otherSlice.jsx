import { createSlice } from '@reduxjs/toolkit'

let fallbackAlertState = {
	open: false,
	msg: 'Your\'re currently offline. \n Check your network and try again', 
	severity: 'error'
}

const initialState = {
	fetched: [],
	currentSelectedUser: {},
	onlineUsers: [],
	showLoaderProfile: false,

	/** @params
		open: Boolean,
		msg: String,
		severity: String
	**/
	alert: {
		...fallbackAlertState
	}
}

const otherSlice = createSlice({
	name: 'other',
	initialState,
	reducers: {
		setSelectedUser: (state, action) => {
			state.currentSelectedUser = action.payload
		},
		assertFetch: (state, action) => {
			const username = action.payload
			state.fetched.push({username})
		},
		clearFromFetched: (state, action) => {
			const friendsName = action.payload
			const find = state.fetched.findIndex(i => i === friendsName)
			if (find !== -1) {
				state.fetched.splice(find, 1)
			}
		},
		handleAlert: (state, action) => {
			let {open} = action.payload
			if (!open) state.alert.open = false
			else {
				state.alert = {...fallbackAlertState, ...action.payload}
			}
		}
	},

})

export const {
	setSelectedUser,
	assertFetch,
	handleAlert,
	clearFromFetched,
} = otherSlice.actions

export default otherSlice.reducer