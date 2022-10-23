import { net_service } from '../services/net-service'

export const saveUnreadChat = ({sender, chatId}) => {
	const method = 'PUT'
	const url = "chat/saveUnread"
	const req_body = {sender, chatId}
	net_service({
		method, url, body: req_body
	})
	.then(res => {
		console.log(res)
	})
}

export const fetchMessages = ({username}, cb) => {
	const method = "GET"
	const url = `/chat/fetchMessages/${username}`
	net_service({
		method, url
	}).then(res => cb(res))
}