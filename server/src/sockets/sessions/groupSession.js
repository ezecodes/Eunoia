
function GroupSession() {
	this.session = new Map()

	this.getUsers = _id => {
		return this.session.get(_id)
	}

	this.appendGroup = ({_id, participants}) => {
		this.session.set(_id, participants)
	}
}

let groupSession = new GroupSession()

module.exports = groupSession