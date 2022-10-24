const headers = new Headers()
headers.append('Content-Type', 'application/json')

export function matchPassword(body, cb) {
	body = JSON.stringify(body)
	const [url, method] = ['/account/matchPassword', 'POST']
	fetch(url, {
		method, headers, body
	})
	.then(res => {
		cb(res)
	})
	.catch(err => {})
}

export function resetPassword(body, cb) {
	body = body = JSON.stringify(body)
	const [url, method] = ['/account/updatePassword', 'PUT']
	fetch(url, {
		method, headers, body
	})
	.then(res => {
		cb(res)
	})
	.catch(err => {})
}

export function updateSocials (body, cb) {
	body = JSON.stringify(body)
	const [url, method] = ['/account/updateSocials', 'PUT']
	fetch(
		url,
		{method, headers, body}
	)
	.then(res => {
		cb(res)
	})
}

export function deleteSocial (body, cb) {
	body = JSON.stringify(body)
	const [url, method] = ['/account/updateSocials', 'PUT']
	fetch(
		url,
		{method, headers, body}
	)
	.then(res => {
		cb(res)
	})
}