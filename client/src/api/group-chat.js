import { net_service } from '../services/net-service'

export const fetchGroupInfo = (groupId, cb) => {
	const url = `/chat/fetchGroupInfo/${groupId}`
	const method = "GET"	
	net_service({url, method}).then(res => cb(res))
}

export const setGroupUnread = (body) => {
	const url = `/chat/setGroupUnread`
	const method = "PUT"
	net_service({url, method, body}).then(res => {})
}

export const clearGroupUnread = (body, cb) => {
	const url = `/chat/clearGroupUnread`
	const method = "PUT"
	net_service({url, method, body}).then(res => {})
}

export const fetchGroupChats = ({groupId}, cb)	=> {
	const url = `/chat/fetchGroupChats/${groupId}`
	const method = "GET"
	net_service({url, method}).then(res => cb(res))
}

export const leaveGroup = (body) => {
	const [url, method] = ['/chat/deleteGroup', 'DELETE']
	net_service({url, method}).then(res => {})
}