import React from 'react'
import { TextField, IconButton, Button } from '@material-ui/core'
import { AccountCircle, AlternateEmail } from '@material-ui/icons'
import styled from 'styled-components'

const Root = styled.div`
	display: flex;
	justify-content: flex-end;

	& > input {
		margin-right: 10px;
	}
`

// function PreIcon(id) {
// 	if (id === 'username') {
// 		return (
// 			<InputAdornment position='start'>
// 				<AccountCircle fontSize='small' color='secondary' />
// 			</InputAdornment>
// 		)
// 	}
// 	if (id === 'email') {
// 		return (
// 			<InputAdornment position='start'>
// 				<AlternateEmail fontSize='small' color='secondary' />
// 			</InputAdornment>
// 		)
// 	}
// 	return (<> </>)
// }

export default function Input({autoComplete, type, id, value, error, helperText, onChange}) {
	return <TextField
		required
		type={type} 
		id={id} 
		autoComplete={autoComplete}
		variant='outlined' 
		color='primary' 
		value={value}
		error={error} 
		helperText={helperText}
		onChange={onChange}
	/>
}

export function Check({checked, onChange}) {
	return (
		<Root>
			<input type='checkbox' id='persistLogin' onChange={onChange} />
			<label htmlFor="persistLogin">Keep me logged in</label>
		</Root>
	)
}