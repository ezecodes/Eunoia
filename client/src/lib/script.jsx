export function getTime(date) {
	let year, day

	let str = date.toDateString()
	let match = str.match(/[0-9][0-9][0-9][0-9]/)

	if (match !== null) {
		year = match[0]
		day = str.slice(0, match.index-1)
	}
	return {year, day}
}

export function retrieveDate(_date = new Date()) {
	let date = _date.toDateString()
	const index = (/[0-9](?=[0-9]{3})/).exec(date)['index']
	const year = date.split('').splice(index).join('')
	const day = date.split('').splice(0, index-1).join('')
	const time = _date.toLocaleTimeString('en-US', {hour12: true, hour: '2-digit', minute: '2-digit'})
	const fullDate = _date.toString()

	return {year, day, fullDate, time}
}

export function getDateValue(chatId, timestamp) {
	const oldDate = getTime(new Date(chatId))
	const newDate = getTime(new Date())

	if (oldDate.day === newDate.day) {
		return timestamp.time
	} else {
		return oldDate.day
	}
		
}

export async function handleFetch(url = '', method = '', body = {}, callback = () => {}, errorhandler = () => {}) {
	if (method.toLowerCase() === 'get') {

		const res = fetch(url)
		return res.json()

	} else {

		fetch(url, {
			method: method,
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json'
			},
			body: JSON.stringify(body)
		})
		.then(res => res.json())
		.then(res => {
			callback(res)
		})
		.catch(err => {
			// console.log(err)
			errorhandler()
		})
	}
}

export function getLastSeen(timestamp) {
	if (!timestamp) return 'recently'
	let newDate = new Date()
	let oldDate = new Date(timestamp)
	let mins = oldDate.toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute: '2-digit'})
	
	if (oldDate.toDateString() === newDate.toDateString()) {
		return mins
	} else {
		let dateStr = oldDate.toDateString()
		let idx = (/[0-9](?=[0-9]{3})/).exec(dateStr)['index']
		let day = dateStr.split('').splice(0, idx-1).join('')

		return day
	}
}

export function assert(obj) {
	/** 
		THIS FUNCTION BASICALLY CHECKS FOR
		A PREDEFINED SET OF JAVASCRIPT DATA TYPES AND RETURNS EITHER TRUE OR FALSE
		DATA TYPES EXPECTED: ARRAY, OBJECT LITERAL, STRING, NUMBER, BOOLEAN, NULL & UNDEFINED
	**/
	try {
		
		if (obj === undefined || obj === null) return false
		if (typeof obj === 'number') {
			if (obj !== -1) return true
				else return false
		}
		if (typeof obj === 'boolean') return obj

		if (Array.isArray(obj)) {
			if ( obj.length > 0) {
				return true
			} else {
				return false
			}
		}
		if (Object.keys(obj).length > 0) return true
	} catch (err) {
		return err
	}
	return false
}