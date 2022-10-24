import { net_service } from '../services/net-service'

export const getActiveUsers = cb => {
	const method = "GET"
	const url = "/account/users"
	net_service({url, method}, res => cb(res))
}