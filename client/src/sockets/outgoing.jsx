
import {socket} from './init'

function sendToServer(eventName, argsArray) {
	socket.emit(eventName, ...argsArray)
}

export default function emit(name, ...args) {
	sendToServer(name, args)
}