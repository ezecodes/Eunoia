import React from 'react'
import InputBase from "@material-ui/core/InputBase";
import IconButton from '@material-ui/core/IconButton'

import InputAdornment from '@material-ui/core/InputAdornment';

import SendIcon from '@material-ui/icons/Send';


function MessageInput({value, sendMessage = () => {}, handleTextInput = () => {}}) {
	const listenForEnter = (e) => {
		if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
			e.preventDefault()
			sendMessage()
		}
	}
	return (
		<InputBase
  		multiline
  		placeholder='Type your messages'
  		onChange={({target}) => handleTextInput(target.value)}
  		maxRows={4}
  		value={value}
  		onKeyDown={listenForEnter}
  		minRows={1}
  		endAdornment={
				<InputAdornment position="end" style={{height: '100%'}}>
					<IconButton onClick={sendMessage} >
	      		<SendIcon color='primary' />
	      	</IconButton>
				</InputAdornment>
			}
  	/>
	)
}

export default MessageInput