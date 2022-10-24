import { net_service } from '../services/net-service'

export const getAccountData = (cb) => {
	const [url, method] = ['/account/accountData', 'GET']
	net_service({url, method}, res => cb(res))
}

export const updateSocials = (body, cb) => {
	const [url, method] = ['/account/updateSocials', 'PUT']
	net_service({
		url, method, body
	}, res => cb(res))
}

export const deleteSocial = (body, cb) => {
	const [url, method] = ['/account/deleteSocial', "delete"]
	net_service({url, method, body})
}

export const saveProfileInfo = (body, cb) => {
	const [url, method]	= ['/account/saveProfileInfo', 'PUT']
	net_service({url, method, body}, res => cb(res))
}

export const matchPassword = (body, cb) => {
	const [url, method] = ['/account/matchPassword', "PUT"]
	net_service({url, method, body}, res => cb(res))
}

export const resetPassword = (body, cb) => {
	const [url, method] = ['/account/updatePassword', "PUT"]
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