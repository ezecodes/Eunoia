import { io } from 'socket.io-client'

const DEFAULT_SOCKET_NAMESPACE = '/user'

export const socket = io(DEFAULT_SOCKET_NAMESPACE, {autoConnect: false, forceNew: true})

export default function init(auth) {
	const {token, username} = auth

	socket.auth = { token, username }
	socket.connect()
	
}