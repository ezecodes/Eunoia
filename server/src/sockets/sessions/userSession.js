class UserSession {

	constructor() {
		this.userSession = new Map()
	}

	getUser(name) {
		return this.groupSession.get(name)
	}

	getAllUsers() {

		// return 
	}
	
	appendUser({name, socketId}) {
		this.userSession.set(name, socketId)
	}
	
}

module.exports = UserSession