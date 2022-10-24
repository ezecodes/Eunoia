import { net_service } from '../services/net-service'

export const getAccountData = (cb) => {
	const [url, method] = ['/account/accountData', 'GET']
	net_service({url, method}, res => cb(res))
}

export const saveProfileInfo = (body, cb) => {
	const [url, method]	= ['/account/saveProfileInfo', 'PUT']
	net_service({url, method, body}, res => cb(res))
}

export const setNotify = (body, cb) => {
	const [url, method] = ['/account/setNotify', 'PUT']
	net_service({url, method, body}, res => cb(res))
}

export const logout = (cb) => {
	const [url, method] = ['/auth/logout', 'DELETE']
	net_service({url, method}, res => cb(res))
}