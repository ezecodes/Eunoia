import { net_service } from '../services/net-service'

export const getRecentChats = async (cb) => {
	const method = "GET"
	const url = '/chat/recentChats'
	net_service({url, method}, res => cb(res))
}

export const starChat = async (body) => {
	const method = "PUT"
	const url = '/chat/starConversation'
	net_service({url, method, body})
}

export const clearRecentChat = async (body) => {
	const [url, method] = ['/chat/clearConversation', "DELETE"]
	net_service({url, method, body})
}
