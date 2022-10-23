import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
	account: {
		showLoader: true,
		socketId: '',
		online: false,
		bio: '',
		socials: [],
		createdGroups: [],
		...JSON.parse(localStorage.getItem('user')),
	}
}

const accountSlice = createSlice({
	name: 'account',
	initialState,
	reducers: {
		setOnline: (state, action) => {
			state.account.online = action.payload
		},
		setNewSocial: (state, action) => {
			const newSocial = action.payload
			const find = state.account.socials.findIndex(i => i.name === newSocial.name)

			if (find === -1) {
				state.account.socials.push(newSocial)
			} else {
				state.account.socials[find] = newSocial
			}

		},
		handleDeleteSocial: (state, action) => {
			const social = action.payload
			const find = state.account.socials.findIndex(i => i.name === social.name)

			state.account.socials.splice(find)
		},
		editAccountInfo: (state, action) => {
			state.account = {...state.account, ...action.payload}
		},
		profileUpdate: (state, action) => {
			state.account = {...state.account, ...action.payload}
		},
		storeAccountData: (state, action) => {
			state.account = {...state.account, ...action.payload}
		}
	},
	extraReducers: builder => {
	
	}

})

export const {
	setNewSocial,
	setOnline,
	handleDeleteSocial,
	editAccountInfo,
	profileUpdate,
	storeAccountData
} = accountSlice.actions

export default accountSlice.reducer