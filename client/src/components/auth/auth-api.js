export const signIn = async (user, cb) => {
	try {
		let response = await fetch('/auth/login', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
	      'Accept': 'application/json'
			},
			body: JSON.stringify(user)
		})
		cb(response)
	} catch(err) {
		console.log(err)
	}
}

export const register = async (user) => {
	try {
		let response = await fetch('/auth/register', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
	      'Accept': 'application/json'
			},
			body: JSON.stringify(user)
		})
		return await response.json()
	} catch(err) {
		console.log(err)
	}
}

export const signOut = () => {

}