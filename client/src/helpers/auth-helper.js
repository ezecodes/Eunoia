
export const storeCredentials = (auth, cb) => {
	const {jwt, username, id} = auth
	sessionStorage.setItem('jwt', JSON.stringify(jwt))
	localStorage.setItem('user', JSON.stringify({username, id}))
	cb()
}

export const storeJwt = (jwt) => {
	sessionStorage.setItem('jwt', JSON.stringify(jwt))
}

export const clearAuth = () => {
	sessionStorage.clear()
	localStorage.clear()
}