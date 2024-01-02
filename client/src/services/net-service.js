import {storeJwt} from '../helpers/auth-helper'

function getRefreshToken(cb) {
	const {id: userId} = JSON.parse(localStorage.getItem('user'))
	const headers = new Headers()
	headers.append('Content-Type', 'application/json')
	headers.append('Authorization', `Bearer ${userId}`)

	const req_options = {
		method: 'GET',
		headers
	}

	fetch('http://localhost:4200' + '/auth/refresh', req_options)
	.then(res => res.json())
	.then(data => {
		storeJwt(data.jwt)
		cb()
	})
}

export async function net_service(req_obj, cb = () => {}) {
	const {method, url} = req_obj
	const headers = new Headers()
	headers.append('Content-Type', 'application/json')

	if (method.toUpperCase() === "GET") {
		try {
			let response = await fetch(
			 	'http://localhost:4200' + url,
			 	{method, headers}
			)
			if (response.ok) cb(await response.json())
			else {
				if (response.status === 401 && response.statusText === 'Unauthorized') {
					getRefreshToken(() => net_service(req_obj, cb))
				}
			}
			return
		} catch(err) {}
	} else {
		try {
			let body = req_obj?.body || {}
			let response = await fetch(
			 	'http://localhost:4200' + url, 
			 	{method, headers, body: JSON.stringify(body)}
			) 
			if (response.ok) cb(await response.json())
			else {
				if (response.status === 401 && response.statusText === 'Unauthorized') {
					getRefreshToken(() => net_service(req_obj, cb))
				}
			}
		} catch(err) {}
	}
		
}