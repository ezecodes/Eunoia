import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	rightPane: false,
	leftPane: true,
	profile: false,
	gInfos: {
		gRoot: false,
		gSettings: false,
		gMembers: false,
	},
	stack: {
		recentChats: true,
		activeUsers: false,
		settings: false,
		resetPassword: false,
		contactInfo: false,
		newGroup: false
	}
		
}

function loopObjects(parent, component, value) {
	for (let val in parent) {
		if (val === component) {
			if (value !== undefined && value !== null) parent[val] = value 
			else parent[val] = true
		} else {
			parent[val] = false
		}
	}
	return parent
}

const componentSlice = createSlice({
	name: 'components',
	initialState,
	reducers: {
		setComponents: (state, action) => {
			const {parent, component, value} = action.payload

			if (parent === 'stack') {
				state.stack = loopObjects(state.stack, component, value)
			} else if (parent === 'gInfos') {
				state.gInfos = loopObjects(state.gInfos, component, value)
			} else {
				state[`${parent}`] = component
			}

		},
	}
})

export const {
	setComponents
} = componentSlice.actions

export default componentSlice.reducer