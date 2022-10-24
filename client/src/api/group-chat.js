import { net_service } from '../services/net-service'

export const fetchGroupInfo = (groupId, cb) => {
	const url = `/chat/fetchGroupInfo/${groupId}`
	const method = "GET"	
	net_service({url, method}, res => cb(res))
}

export const starGroup = ({body, groupId}) => {
	const url = `/chat/starGroup/${groupId}`
	const method = "PUT"
	console.log(body)
	net_service({url, method, body})
}

export const setGroupUnread = (body) => {
	const url = `/chat/setGroupUnread`
	const method = "PUT"
	net_service({url, method, body}, res => cb(res))
}

export const clearGroupUnread = (body, cb) => {
	const url = `/chat/clearGroupUnread`
	const method = "PUT"
	net_service({url, method, body}, res => cb(res))
}

export const fetchGroupChats = ({groupId}, cb)	=> {
	const url = `/chat/fetchGroupChats/${groupId}`
	const method = "GET"
	net_service({url, method}, res => cb(res))
}

export const leaveGroup = (body) => {
	const [url, method] = ['/chat/deleteGroup', 'DELETE']
	net_service({url, method, body})
}