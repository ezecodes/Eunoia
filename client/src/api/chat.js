import { net_service } from '../services/net-service'

export const saveUnreadChat = ({sender, chatId}) => {
	const method = 'PUT'
	const url = "/chat/saveUnread"
	const req_body = {sender, chatId}
	net_service({
		method, url, body: req_body
	})
}

export const fetchMessages = ({username}, cb) => {
	const method = "GET"
	const url = `/chat/fetchMessages/${username}`
	net_service({
		method, url
	}, res => cb(res))
}