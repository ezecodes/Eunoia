module.exports = { handleError }

function handleError(err) {
	const {message: errMessage} = err
	let errors = {
		username: '',
		email: '',
		password: ''
	}

	// if (errMessage.includes('user validation failed')) {
	// 	Object.values(err.errors).forEach(({properties}) => {
	// 		errors[properties.path] = properties.message
	// 	})
	// 	return errors
	// } 

	// Duplicate fields error
	if (err.code === 11000) {
		if (err.keyPattern.hasOwnProperty('email')) {
			errors.email = 'This email is already registered'
		}
		if (err.keyPattern.hasOwnProperty('username')) {
			errors.username = 'This name already exists'
		}
		return errors
	}
}
